# Chefalio Backend

REST API for the Chefalio platform — a marketplace where chefs publish recipes and sell cookbooks.

Built with **NestJS**, **MongoDB**, and **Stripe**.

**Live API:** https://chefalio-backend-irfanulamins-projects.vercel.app · **Frontend:** https://www.chefalio.xyz ([repo](https://github.com/Irfanulamin/chefalio-frontend))

---

## Tech Stack

| Layer        | Technology             |
| ------------ | ---------------------- |
| Framework    | NestJS (TypeScript)    |
| Database     | MongoDB via Mongoose   |
| Auth         | JWT (httpOnly cookies) |
| Payments     | Stripe Checkout        |
| Image Upload | Cloudinary             |
| Email        | Resend                 |
| OAuth        | Google (Passport)      |
| Realtime     | Socket.IO notifications |
| AI           | Anthropic Claude       |

---

## Getting Started

**1. Clone and install**

```bash
git clone https://github.com/Irfanulamin/chefalio-backend.git
cd chefalio-backend
pnpm install
```

**2. Configure environment**

```bash
cp .env.example .env
# Fill in all values in .env
```

**3. Run**

```bash
# Development
pnpm run start:dev

# Production
pnpm run build
pnpm run start:prod
```

Server starts on `PORT` defined in `.env` (default: `5000`).

---

## Environment Variables

| Variable                | Description                                   |
| ----------------------- | --------------------------------------------- |
| `NODE_ENV`              | `development` or `production`                 |
| `PORT`                  | Server port                                   |
| `MONGODB_URI`           | MongoDB connection string                     |
| `JWT_SECRET`            | Secret for signing JWT tokens                 |
| `ALLOWED_ORIGIN`        | Frontend URL (used for CORS in production)    |
| `RESET_PASSWORD_URL`    | Frontend reset password page URL              |
| `FRONTEND_URL`          | Frontend base URL (used for Stripe redirects) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                         |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                            |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                         |
| `RESEND_API_KEY`        | Resend email API key                          |
| `STRIPE_SECRET_KEY`     | Stripe secret key                             |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret                 |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID                        |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret                    |
| `GOOGLE_CALLBACK_URL`   | OAuth callback, e.g. `http://localhost:5000/auth/google/callback` |
| `ANTHROPIC_API_KEY`     | Anthropic API key for AI features             |

---

## Project Structure

```
src/
├── auth/                  # JWT + Google OAuth, guards, password reset
├── user/                  # User CRUD, admin controls
├── chef/ chef-profile/    # Chef profiles and dashboards
├── chef-application/      # Apply-to-become-chef flow
├── recipe/                # Recipe creation and management
├── recipe-interaction/    # Save / love interactions
├── cookbook/              # Cookbook listings
├── cookbook-purchase/     # Stripe checkout & webhook
├── follow/                # Follow chefs
├── notifications/         # Realtime notifications (Socket.IO)
├── ai/                    # Anthropic-powered features
├── seeds/                 # Demo account + seed data
├── services/              # Cloudinary, mail
├── common/                # Pipes, shared utilities
├── app.module.ts
└── main.ts                # Local bootstrap + Vercel serverless handler
```

---

## Roles

| Role    | Capabilities                                                              |
| ------- | ------------------------------------------------------------------------- |
| `user`  | Browse recipes, save/love, purchase cookbooks                             |
| `chef`  | All user permissions + create recipes & cookbooks, view orders & earnings |
| `admin` | Full access + user management, platform analytics                         |

---

## Key API Endpoints

| Method | Endpoint                     | Auth         | Description                             |
| ------ | ---------------------------- | ------------ | --------------------------------------- |
| POST   | `/auth/register`             | Public       | Register new user                       |
| POST   | `/auth/login`                | Public       | Login (sets httpOnly cookie)            |
| POST   | `/auth/logout`               | Public       | Clear auth cookie                       |
| POST   | `/auth/forgot-password`      | Public       | Send reset email                        |
| POST   | `/auth/reset-password`       | Public       | Reset password via token                |
| GET    | `/auth/profile`              | Auth         | Get current user profile                |
| GET    | `/recipes/all`               | Auth         | List recipes (search, filter, paginate) |
| POST   | `/recipes/create`            | Chef         | Create recipe (3 images required)       |
| DELETE | `/recipes/:id`               | Chef / Admin | Delete recipe                           |
| GET    | `/cookbooks`                 | Auth         | List cookbooks                          |
| POST   | `/cookbook-purchase/payment` | Auth         | Create Stripe checkout session          |
| POST   | `/cookbook-purchase/webhook` | Stripe       | Handle payment confirmation             |
| GET    | `/users/all`                 | Admin        | List all users                          |

---

## Running Tests

```bash
pnpm run test          # Unit tests
pnpm run test:e2e      # End-to-end tests
pnpm run test:cov      # Coverage report
```
