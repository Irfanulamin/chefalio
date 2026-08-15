import axiosInstance from "./axiosInstance"
import { queryClient } from "@/lib/queryClient"

// ── Queue of requests waiting for an in-flight refresh ───────────────────────

type QueueEntry = { resolve: () => void; reject: (err: unknown) => void }
let isRefreshing = false
let pendingQueue: QueueEntry[] = []

function flushQueue(error: unknown) {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(),
  )
  pendingQueue = []
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const GUEST_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
]

const isGuestRoute = () =>
  window.location.pathname === "/" ||
  GUEST_ROUTES.some((r) => window.location.pathname.startsWith(r))

function redirectToLogin() {
  queryClient.clear()
  window.location.href = "/sign-in"
}

// ── Interceptor ───────────────────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status: number | undefined = error?.response?.status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = error?.config as any

    if (status === 401 && !config?._retry && !isGuestRoute()) {
      // The refresh call itself failed → hard logout
      if (config?.url === "/auth/refresh") {
        redirectToLogin()
        return Promise.reject(error)
      }

      // Another refresh is already running → queue this request
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        }).then(() => axiosInstance(config))
      }

      config._retry = true
      isRefreshing = true

      try {
        await axiosInstance.post("/auth/refresh")
        flushQueue(null)
        return axiosInstance(config)
      } catch (refreshErr) {
        flushQueue(refreshErr)
        redirectToLogin()
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    const message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      "Something went wrong"

    return Promise.reject(new Error(message))
  },
)

export default axiosInstance
