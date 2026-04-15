# Campus Leaders Platform (Uzbekistan)

Production-ready MVP for campus community management:

- Public discovery of campus teams, events, and news
- Custom DB-backed token authentication (no JWT)
- Role-based access (SUPER_ADMIN, CAMPUS_ADMIN, USER)
- Admin panels for team/member/event/news management
- MongoDB + Mongoose and Cloudinary image upload support

## Tech Stack

- Next.js App Router + API routes
- Tailwind CSS
- MongoDB with Mongoose
- Custom secure token sessions stored in DB
- Cloudinary for file uploads

## Environment Variables

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

Required:

- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Run Locally

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Demo Admin Accounts

For local testing, open `/login` and click **Create demo admins**.

- SUPER_ADMIN: `superadmin@campusleaders.uz` / `SuperAdmin123!`
- CAMPUS_ADMIN: `campusadmin@campusleaders.uz` / `CampusAdmin123!`

`/api/dev/seed-demo` is development-only and blocked in production.

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Teams

- `GET /api/teams`
- `GET /api/teams/:id`
- `POST /api/teams` (SUPER_ADMIN)
- `PUT /api/teams/:id` (SUPER_ADMIN or own CAMPUS_ADMIN team)
- `DELETE /api/teams/:id` (SUPER_ADMIN)

### Members

- `POST /api/members` (ADMIN)
- `PUT /api/members/:id` (ADMIN own team)
- `DELETE /api/members/:id` (ADMIN own team)

### Events

- `GET /api/events`
- `POST /api/events` (ADMIN)
- `PUT /api/events/:id` (ADMIN own team)
- `DELETE /api/events/:id` (ADMIN own team)

### News

- `GET /api/news`
- `POST /api/news` (ADMIN, global news only for SUPER_ADMIN)
- `PUT /api/news/:id` (ADMIN with scope checks)
- `DELETE /api/news/:id` (ADMIN with scope checks)

### Users

- `GET /api/users` (SUPER_ADMIN)
- `POST /api/users/create-admin` (SUPER_ADMIN)

### Upload

- `POST /api/upload` (ADMIN, multipart with `file`)

## Auth Flow (No JWT)

- On login, server creates random secure token and saves it in `sessions` collection.
- Client sends token in `Authorization: Bearer <token>`.
- Protected routes validate token against DB and load user context.
