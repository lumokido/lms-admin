# Lumokido LMS Admin Portal

A modern, high-performance **Learning Management System (LMS) Admin Portal** built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and styled with a crisp **White & Light Blue** aesthetic using **Tailwind CSS v4** and **Lucide Icons**.

---

## 🎨 Theme & Aesthetics

- **Primary Colors**: White (`#ffffff`), Soft Light Blue (`#f0f9ff`, `#e0f2fe`), Sky Blue (`#0ea5e9`, `#0284c7`), Slate typography (`#0f172a`, `#334155`).
- **Cards & Surfaces**: Clean white surfaces with light slate/sky borders and subtle shadow elevations.
- **Accents**: Ocean & Sky blue indicators with status pills and micro-interactions.

---

## 🚀 Key Modules & Capabilities

1. **Dashboard Overview (`/`)**
   - Live KPI Metrics: Total Students, Active Courses, Average Curriculum Completion, and Pending Reviews.
   - Monthly Enrollment Trends & Course Track distribution.
   - Featured Courses leaderboard with enrollments and ratings.
   - Real-time System Activity stream.

2. **Courses Management (`/courses`)**
   - Filter by categories (Development, Data & AI, Design, Business, Marketing) and status (Published, Draft, Archived).
   - Switchable Grid and Table views.
   - Interactive Course Builder Modal: Add/edit course details, instructor, pricing, duration, and multi-module curriculum breakdown.
   - Instant 1-click status toggle (Publish/Draft).

3. **Students Directory (`/students`)**
   - Learner directory with avatars, email, enrolled courses count, and progress bars.
   - Student Profile Drawer: Deep inspection of all enrolled courses, individual progress, and grades.
   - Enroll New Student modal with immediate directory updates.

4. **Faculty & Instructors (`/instructors`)**
   - Educator directory showing active courses, student count, credentials, and performance ratings.
   - Register new faculty modal with specialties and bio.

5. **Enrollment Telemetry (`/enrollments`)**
   - Real-time enrollment transaction stream with curriculum progress and last active timestamps.
   - One-click CSV Export functionality for audit reporting.

6. **Assignments & Grading Queue (`/assignments`)**
   - Queue filtered by All, Pending Review, Graded, and Late Submissions.
   - Grade Evaluation modal: Input scores out of 100 with qualitative instructor feedback.

7. **Platform Settings (`/settings`)**
   - Academy identity, portal branding, and support contacts.
   - Passing grade thresholds and automated certification policies.
   - Instructor notifications and maintenance mode switches.

8. **Reactive State & Persistence**
   - Built-in React context (`LMSContext`) with automatic `localStorage` synchronization for instantaneous demo interactions.

---

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to access the admin portal.
