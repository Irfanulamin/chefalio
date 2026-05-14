import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from './axios/axiosInstance';
import { toast } from 'sonner';
import type {
  ChefApplication,
  ChefApplicationStats,
  SubmitChefApplicationPayload,
} from '@/types/chef-application.type';

// ── Keys ─────────────────────────────────────────────────────────────────────

const KEYS = {
  myApplication: ['chef-application', 'me'] as const,
  all: (status?: string, page?: number) =>
    ['chef-applications', status, page] as const,
  one: (id: string) => ['chef-application', id] as const,
  stats: ['chef-application-stats'] as const,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildFormData(payload: SubmitChefApplicationPayload): FormData {
  const fd = new FormData();
  fd.append('fullName', payload.fullName);
  fd.append('bio', payload.bio);
  fd.append('specialty', payload.specialty);
  fd.append('yearsOfExperience', String(payload.yearsOfExperience));
  fd.append('kycType', payload.kycType);
  fd.append('kycDocument', payload.kycDocument);
  fd.append('referenceUrl', payload.referenceUrl);
  if (payload.youtubeUrl) fd.append('youtubeUrl', payload.youtubeUrl);
  if (payload.achievements.length)
    fd.append('achievements', JSON.stringify(payload.achievements));
  if (payload.instagramUrl) fd.append('instagramUrl', payload.instagramUrl);
  if (payload.facebookUrl) fd.append('facebookUrl', payload.facebookUrl);
  if (payload.twitterUrl) fd.append('twitterUrl', payload.twitterUrl);
  return fd;
}

// ── User hooks ────────────────────────────────────────────────────────────────

export function useMyChefApplication() {
  const { data, isLoading, error } = useQuery({
    queryKey: KEYS.myApplication,
    queryFn: () =>
      axiosInstance
        .get<{ success: boolean; data: ChefApplication | null }>(
          '/chef-applications/me',
        )
        .then((r) => r.data),
    staleTime: 1000 * 30,
  });

  return {
    application: data?.data ?? null,
    isLoading,
    error,
  };
}

export function useSubmitChefApplication() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitChefApplicationPayload) =>
      axiosInstance
        .post('/chef-applications', buildFormData(payload), {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast.success('Application submitted! We will review it shortly.');
      void qc.invalidateQueries({ queryKey: KEYS.myApplication });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(
        err?.response?.data?.message ?? 'Failed to submit application',
      );
    },
  });
}

export function useResubmitChefApplication() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitChefApplicationPayload) =>
      axiosInstance
        .patch('/chef-applications/me/resubmit', buildFormData(payload), {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast.success('Application resubmitted! We will review it shortly.');
      void qc.invalidateQueries({ queryKey: KEYS.myApplication });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(
        err?.response?.data?.message ?? 'Failed to resubmit application',
      );
    },
  });
}

// ── Admin hooks ───────────────────────────────────────────────────────────────

export function useAllChefApplications(status?: string, page = 1) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: KEYS.all(status, page),
    queryFn: () =>
      axiosInstance
        .get<{
          success: boolean;
          data: ChefApplication[];
          pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        }>('/chef-applications', { params: { status, page } })
        .then((r) => r.data),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });

  return {
    applications: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
  };
}

export function useChefApplicationStats() {
  const { data, isLoading } = useQuery({
    queryKey: KEYS.stats,
    queryFn: () =>
      axiosInstance
        .get<{ success: boolean; data: ChefApplicationStats }>(
          '/chef-applications/stats',
        )
        .then((r) => r.data),
    staleTime: 1000 * 60,
  });

  return { stats: data?.data, isLoading };
}

export function useChefApplicationById(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: KEYS.one(id),
    queryFn: () =>
      axiosInstance
        .get<{ success: boolean; data: ChefApplication }>(
          `/chef-applications/${id}`,
        )
        .then((r) => r.data),
    enabled: !!id,
    staleTime: 1000 * 30,
  });

  return { application: data?.data, isLoading };
}

export function useApproveChefApplication() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.patch(`/chef-applications/${id}/approve`).then((r) => r.data),
    onSuccess: (_data, id) => {
      toast.success('Application approved. User is now a chef!');
      void qc.invalidateQueries({ queryKey: KEYS.one(id) });
      void qc.invalidateQueries({ queryKey: ['chef-applications'] });
      void qc.invalidateQueries({ queryKey: KEYS.stats });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Failed to approve application');
    },
  });
}

export function useRejectChefApplication() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rejectionNote }: { id: string; rejectionNote: string }) =>
      axiosInstance
        .patch(`/chef-applications/${id}/reject`, { rejectionNote })
        .then((r) => r.data),
    onSuccess: (_data, { id }) => {
      toast.success('Application rejected.');
      void qc.invalidateQueries({ queryKey: KEYS.one(id) });
      void qc.invalidateQueries({ queryKey: ['chef-applications'] });
      void qc.invalidateQueries({ queryKey: KEYS.stats });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Failed to reject application');
    },
  });
}
