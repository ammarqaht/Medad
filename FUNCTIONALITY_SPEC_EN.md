# Platform Functionality Specification — Multi-Tenant Program Management

> This file contains every feature extracted from the "Hilyah 2" project,
> re-architected to be generic and multi-tenant — any organization can create
> their own program with custom name, logo, colors, and settings.
>
> **Purpose:** Complete reference for building the new project with Claude Code.
> **Language:** The platform UI is Arabic (RTL). This spec is in English for clarity.

---

## 1. Platform Overview

A platform that lets any organization create a "training program" with:
- Custom program name, logo, and brand colors
- Tasks for participants to complete and submit
- Supervisor review and grading workflow
- Leaderboard and points system
- Analytics dashboard
- CMS for customizable content

---

## 2. Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ── Tenant / Program ─────────────────────────────
model Program {
  id           String   @id @default(cuid())
  name         String                          // e.g. "حلية"
  slug         String   @unique                // URL-safe: /program/hilyah
  logoUrl      String?
  primaryColor String   @default("#5CC481")
  description  String?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())

  users        ProgramUser[]
  tasks        Task[]
  submissions  Submission[]
  settings     Setting[]
  features     Feature[]
}

// ── Users ────────────────────────────────────────
model User {
  id        String        @id @default(cuid())
  name      String
  username  String        @unique
  password  String                              // bcrypt hashed
  createdAt DateTime      @default(now())

  programs  ProgramUser[]
  sessions  Session[]
}

// ── User ↔ Program link (role is per-program) ────
model ProgramUser {
  id        String  @id @default(cuid())
  userId    String
  programId String
  role      Role                                // student | admin | superadmin

  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  program   Program @relation(fields: [programId], references: [id], onDelete: Cascade)

  @@unique([userId, programId])
}

// ── Sessions ─────────────────────────────────────
model Session {
  id        String   @id                        // crypto.randomBytes(32).toString('hex')
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ── Tasks ────────────────────────────────────────
model Task {
  id               String       @id @default(cuid())
  programId        String
  title            String
  description      String
  maxPoints        Int
  dueDate          DateTime
  createdAt        DateTime     @default(now())
  track            String?                       // "عام", "تقني", etc.
  isActive         Boolean      @default(true)
  submissionMethod String?                       // "كتابة ملخص", "رفع ملف", etc.
  assignedAdmins   String[]     @default([])     // admin user IDs
  imageUrl         String?
  resourceLink     String?
  visibility       Visibility   @default(all)
  visibleToIds     String[]     @default([])     // for restricted tasks

  program     Program      @relation(fields: [programId], references: [id], onDelete: Cascade)
  submissions Submission[]

  @@unique([programId, title, dueDate])          // prevent duplicates
}

// ── Submissions ──────────────────────────────────
model Submission {
  id              String   @id @default(cuid())
  userId          String
  taskId          String
  programId       String
  fileUrl         String                         // file URL or "admin://manual-mark"
  status          Status
  grade           Int?
  feedback        String?
  selectedAdminId String?                        // admin chosen by student
  submittedAt     DateTime @default(now())

  task    Task    @relation(fields: [taskId], references: [id], onDelete: Cascade)
  program Program @relation(fields: [programId], references: [id], onDelete: Cascade)

  @@unique([userId, taskId])                     // one submission per student per task
}

// ── Settings (CMS key-value per program) ─────────
model Setting {
  id        String  @id @default(cuid())
  programId String
  key       String
  value     String

  program   Program @relation(fields: [programId], references: [id], onDelete: Cascade)

  @@unique([programId, key])
}

// ── Features (toggleable UI sections) ────────────
model Feature {
  id          String   @id @default(cuid())
  programId   String
  name        String
  description String?
  icon        String   @default("star")
  color       String   @default("#5CC481")
  visible     Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())

  program     Program  @relation(fields: [programId], references: [id], onDelete: Cascade)
}

// ── Enums ────────────────────────────────────────
enum Role {
  student
  admin
  superadmin
}

enum Status {
  pending
  approved
  rejected
}

enum Visibility {
  all
  restricted
}
```

---

## 3. Authentication System

### 3.1 Login
- **Endpoint:** `POST /api/auth/login`
- **Input:** `{ username, password }`
- **Flow:**
  1. Find user by username
  2. Verify password with `bcrypt.compare()`
  3. Generate session token: `crypto.randomBytes(32).toString('hex')`
  4. Store session in DB with `expiresAt` = now + 30 minutes
  5. Set HttpOnly cookie named `session_token`
- **Response:** `{ user: { id, name }, programs: [{ id, slug, name, role }] }`

### 3.2 Session Validation
- **Endpoint:** `GET /api/auth/me`
- Read cookie → find session → check expiry
- **Sliding window:** every authenticated request extends session by 30 min
- Return user data + enrolled programs with roles

### 3.3 Logout
- **Endpoint:** `POST /api/auth/logout`
- Delete session from DB + clear cookie with `Max-Age=0`

### 3.4 Frontend Inactivity Timeout
- After 5 minutes with no mouse/keyboard/touch → auto-logout

---

## 4. Student Features

### 4.1 Dashboard
- Welcome message with student name
- Quick stats: completed tasks count, total points, leaderboard rank
- Upcoming tasks (nearest deadlines)

### 4.2 Tasks
- **List view:** all active tasks (`isActive: true`) the student can see
- **Filter by track:** "عام", "تقني", etc.
- **Task detail:** title, description, max points, due date, submission method, image, resource link
- **Submit task:**
  - Upload file via Supabase Storage OR write text (depending on `submissionMethod`)
  - Optionally select a specific admin from `assignedAdmins`
  - **Resubmission rule:** allowed ONLY if status is `rejected`. `pending` and `approved` are locked
  - Submission is an upsert — one record per student per task
- **Visibility enforcement:** student sees only `visibility: all` tasks, or `restricted` tasks where their ID is in `visibleToIds`
- **Submission status display:** pending / approved / rejected + grade + feedback

### 4.3 Points
- Detailed breakdown: each task with earned grade vs max points
- Total points sum

### 4.4 Leaderboard
- All students ranked by total points (descending)
- Shows: name, total points, completed tasks count
- Highlight current student's rank

### 4.5 Calendar
- Monthly calendar view showing tasks
- Color-coded by status: submitted / not submitted / upcoming

### 4.6 Idea Box (optional — controlled by Feature toggle)
- Simple form to submit suggestions/ideas

---

## 5. Admin Features

### 5.1 Dashboard
- Summary stats: total students, total tasks, total submissions, approval rate
- Quick links to add task, review submissions

### 5.2 Add Task
- **Endpoint:** `POST /api/tasks`
- **Fields:**
  - Title (required)
  - Description (required)
  - Max points (required)
  - Due date (required)
  - Track — optional, defaults to "عام"
  - Submission method — optional
  - Assigned admins — list of admin user IDs
  - Task image URL — optional
  - Resource link — optional
- **Duplicate prevention:** cannot create task with same title + same date within same program

### 5.3 Manage Tasks
- List all tasks with ability to:
  - **Edit:** `PUT /api/tasks/[id]` — update any field
  - **Activate/Deactivate:** toggle `isActive`
  - **Delete:** `DELETE /api/tasks/[id]`
  - **Visibility control:** change `visibility` + `visibleToIds`

### 5.4 Review Submissions
- **Endpoint:** `GET /api/submissions?taskId=...`
- View all submissions for a specific task
- Each submission shows: student name, username, file URL, current status
- **Review actions:** `PUT /api/submissions/[id]`
  - Approve + grade + feedback
  - Reject + feedback
- **Filters:** by status (pending/approved/rejected), by assigned admin
- **Manual grading:** admin can create a submission for a student who didn't submit (`fileUrl: "admin://manual-mark"`)

### 5.5 Review Log
- History of all review actions performed by the admin

### 5.6 Points Management
- View all students' points
- Export as Excel spreadsheet

### 5.7 Analytics / Overview
- **Endpoint:** `GET /api/analytics/overview`
- **Computed stats:**
  - Total students / tasks / submissions
  - Submissions by status: pending / approved / rejected
  - Approval rate percentage
  - Total points distributed
  - Average points per student
  - Program duration (first to last activity)
  - Per-admin performance (how many submissions reviewed)
  - Submissions over time (timeline)
  - Task distribution by track
  - Top and bottom performing students
- **Charts:** bar, pie, line

### 5.8 CMS (Content Management)
- **Endpoint:** `GET/POST /api/settings`
- Edit landing page content: hero text, slider images, any dynamic text
- Key-value store: each setting is a key + value scoped to the program

### 5.9 Features Management
- **Endpoint:** CRUD on `/api/features`
- Toggle UI sections on/off (e.g., idea box, calendar)
- Each feature: name, description, icon, color, order, visible/hidden

### 5.10 Admin List
- **Endpoint:** `GET /api/admins`
- View list of admins in the program

---

## 6. API Routes — Complete Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/logout` | Logout | Authenticated |
| GET | `/api/auth/me` | Current user info | Authenticated |
| GET | `/api/tasks` | List tasks (visibility-filtered) | Public |
| POST | `/api/tasks` | Create task | Admin |
| PUT | `/api/tasks/[id]` | Update task | Admin |
| DELETE | `/api/tasks/[id]` | Delete task | Admin |
| GET | `/api/submissions` | List submissions | Authenticated |
| POST | `/api/submissions` | Create/update submission | Student/Admin |
| PUT | `/api/submissions/[id]` | Review submission | Admin |
| GET | `/api/leaderboard` | Leaderboard ranking | Public |
| GET | `/api/leaderboard/export` | Export as Excel | Admin |
| GET | `/api/settings` | Get settings | Public |
| POST | `/api/settings` | Update settings | Admin |
| GET | `/api/features` | List features | Public |
| POST | `/api/features` | Create feature | Admin |
| PUT | `/api/features/[id]` | Update feature | Admin |
| DELETE | `/api/features/[id]` | Delete feature | Admin |
| GET | `/api/admins` | List admins | Admin |
| GET | `/api/analytics/overview` | Full analytics | Admin |

---

## 7. Business Rules

1. **One submission per student per task** — enforced by `@@unique([userId, taskId])` with upsert logic
2. **Resubmission:** only allowed when status is `rejected`. `pending` and `approved` submissions are locked
3. **Task duplicate prevention:** same title + same date within same program is rejected
4. **Visibility:** students only see `visibility: all` tasks or `restricted` tasks where they're in `visibleToIds`
5. **Session sliding window:** 30-minute expiry, refreshed on every authenticated request
6. **Frontend inactivity timeout:** 5 minutes of no interaction → auto-logout
7. **Admin manual marks:** admins can create submissions on behalf of students without a file
8. **All data is scoped by `programId`** — complete isolation between programs

---

## 8. Page Routes

### Public
- `/` — Landing page (program info, features, CMS content)
- `/login` — Login page
- `/program/[slug]` — Specific program page

### Student
- `/student/dashboard`
- `/student/tasks`
- `/student/tasks/[id]` — Detail + submission
- `/student/points`
- `/student/leaderboard`
- `/student/calendar`
- `/student/ideas`

### Admin
- `/admin/dashboard`
- `/admin/tasks`
- `/admin/tasks/new`
- `/admin/tasks/[id]` — Edit task
- `/admin/tasks/[id]/submissions` — Review submissions
- `/admin/review-log`
- `/admin/points`
- `/admin/overview` — Analytics
- `/admin/cms`
- `/admin/features`

---

## 9. Design Notes

- **Mobile-first:** design starts from mobile viewport
- **RTL + Arabic:** direction is right-to-left, primary language is Arabic
- **Brandable colors:** each program has its own `primaryColor` stored in the `Program` model
- **Feature toggles:** sections like calendar, idea box can be shown/hidden per program
