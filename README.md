# Chefalio

A recipe and cookbook marketplace. Chefs publish recipes and sell cookbooks; food lovers discover, save, and buy them.

**Live:** https://www.chefalio.xyz

This repo holds the whole project: the Next.js frontend at the root and the NestJS API in [`backend/`](backend).

> Want to look around without signing up? Use the demo accounts on the sign-in page (read-only).

## Features

- **Three role-based portals:** users, chefs, and admins, each with its own dashboard
- **Recipes:** browse, search, filter, save and "love" recipes; chef profiles with follow
- **Cookbooks:** chefs bundle recipes into paid cookbooks; checkout via Stripe
- **Chef onboarding:** users apply to become chefs; admins review applications
- **Analytics:** chef earnings and engagement charts, platform-wide admin stats
- **Realtime notifications** over Socket.IO
- **Auth:** email/password with verification and password reset, plus Google sign-in
- Light/dark theme, responsive layouts, smooth motion

## Tech stack

| Area        | Tools                                                |
| ----------- | ---------------------------------------------------- |
| Framework   | Next.js 16 (App Router), React 19, TypeScript        |
| Styling     | Tailwind CSS v4, shadcn/ui, Radix UI                 |
| Data        | TanStack Query, TanStack Table, TanStack Form, Axios |
| Validation  | Zod                                                  |
| Charts      | Recharts                                             |
| Motion      | Framer Motion, Lenis                                 |
| Realtime    | socket.io-client                                     |

## Getting started

Requires Node.js 20+ and pnpm. The API in [`backend/`](backend) must be running for most pages to work; see its README for setup.

```bash
git clone https://github.com/Irfanulamin/chefalio.git
cd chefalio
pnpm install
cp .env.example .env   # then fill in the values
pnpm dev
```

Open http://localhost:3000.

### Environment variables

| Variable                 | Description                                  |
| ------------------------ | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL`    | Backend API base URL                         |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO URL for notifications              |

### Scripts

| Command      | What it does             |
| ------------ | ------------------------ |
| `pnpm dev`   | Start the dev server     |
| `pnpm build` | Production build         |
| `pnpm start` | Serve the production build |
| `pnpm lint`  | Run ESLint               |

## Project structure

```
backend/              # NestJS API (separate package, own README)
app/
├── (guest)/          # sign-in, sign-up, verify email, password reset
├── (user)/           # recipes, cookbooks, chefs, checkout, activity, settings
├── (chef)/chef/      # chef dashboard, recipes, cookbooks, orders, analytics
├── (admin)/admin/    # users, recipes, cookbooks, orders, chef applications
components/           # UI building blocks, grouped by area
hooks/                # data hooks (TanStack Query + Axios), notifications
lib/  types/          # helpers and shared types
```
