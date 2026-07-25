# Product Requirement Document (PRD): InnoVote 2.0

**Document Version:** 4.0.0  
**Status:** Approved / Ready for Engineering  
**Project:** InnoVote 2.0 — Sunway Innovation Fest Voting Platform  
**Target Architecture:** React 19 (Vite) / Node.js / Express / MongoDB  

---

## 1. Executive Summary & Overview

### 1.1 Product Background
**InnoVote 2.0** is the official interactive voting platform designed for **Sunway Innovation Fest**. It enables festival attendees, judges, and visitors to discover participant project booths and cast verified votes.

### 1.2 Core Product Principles
1. **Passwordless OTP Authentication (No Traditional Credentials):** 
   - Zero login credentials required. Authentication relies strictly on **Mobile Number + SMS OTP**.
   - Generated OTPs are hashed using **bcrypt** before storage.
   - On successful OTP verification, the server issues a secure **`httpOnly` cookie** valid for **exactly 20 minutes**.
2. **User Voting Profile & Single Vote Enforcement:**
   - Clicking "Voting Profile" navigates voters to their personal voting dashboard.
   - Voters configure their profile details (e.g. Name/Display Name).
   - Each voter can cast **exactly ONE vote**.
   - Upon voting, their profile dashboard highlights their confirmed voted team/project (e.g. *"You voted for Team Apex — Booth #12"*).
3. **Scheduled Result Reveal (No Live Leaderboard):**
   - Public vote tallies and rankings are strictly hidden from voters during active voting. Results are revealed only at a pre-scheduled timestamp or when manually published by an Administrator.
4. **Comprehensive Admin Panel:**
   - Admin CRUD for Projects, Voter User Management, SMSGATE diagnostics, and Controlled Result Reveal triggers.

---

## 2. User Roles & System Personas

| Role | Description | Core Capabilities |
| :--- | :--- | :--- |
| **Verified Voter** | Event attendee with a mobile phone. | Enters mobile number $\rightarrow$ Receives SMS GATE OTP $\rightarrow$ Sets up Voting Profile $\rightarrow$ Casts 1 vote $\rightarrow$ Views voted team on User Profile Dashboard. |
| **Participant / Exhibitor** | Project presenter at Sunway Innovation Fest. | Views project booth details and QR code. Vote counts remain hidden until official reveal. |
| **Event Administrator** | Event organizer / staff. | **Admin Panel Access**: CRUD Projects, User Management (view voters, block fraudulent numbers), Result Reveal schedule, SMSGATE health monitor. |

---

## 3. Passwordless OTP Auth & User Profile Workflow

### 3.1 Authentication & Voting Profile Lifecycle

```
       +-----------------------------------+
       |     User clicks "Voting Profile"  |
       +-----------------------------------+
                         |
                         v
       +-----------------------------------+
       |     Enter Mobile Phone Number     |
       +-----------------------------------+
                         |
                         v
       +-----------------------------------+
       | Dispatch OTP via SMSGATE (Bcrypt) |
       +-----------------------------------+
                         |
                         v
       +-----------------------------------+
       |   Enter Received 6-Digit OTP      |
       +-----------------------------------+
                         |
                Is OTP Valid & Active?
                       /       \
                  YES /         \ NO
                     v           v
 +---------------------------------------+   +-----------------------+
 | Set httpOnly Cookie (20-min MaxAge)   |   | Prompt Retry / Error  |
 | Navigate to User Voting Profile      |   +-----------------------+
 +---------------------------------------+
                     |
                     v
 +---------------------------------------+
 | Setup Profile & View Voting Dashboard |
 +---------------------------------------+
                     |
            Has User Already Voted?
                   /       \
              NO  /         \ YES
                 v           v
 +-----------------------+   +---------------------------------------+
 | Browse & Cast 1 Vote  |   | Display Voted Team on Profile Dashboard|
 +-----------------------+   | (Voting Disabled)                     |
             |               +---------------------------------------+
             v
 +---------------------------------------+
 | Vote Saved! Dashboard Updates to Show |
 | Voted Team & 20-min Session Expiry    |
 +---------------------------------------+
```

### 3.2 Security & Session Rules
1. **Passwordless Entry:** Mobile number + OTP is the sole auth path. No passwords or account creation forms.
2. **Bcrypt OTP Storage:** OTP passcodes are hashed with `bcrypt` (or salted SHA-256) in database/Redis with a **3-minute TTL**.
3. **20-Minute `httpOnly` Cookie Session:**
   - Cookie Name: `innovote_session`
   - Attributes: `HttpOnly: true`, `SameSite: Strict`, `Secure: true` (in production), `Max-Age: 1200` (20 minutes).
4. **Single-Vote Constraint:** The `User` record tracks `hasVoted: boolean` and `votedProjectId: ObjectId`. Once voted, subsequent vote requests return `409 Conflict`.

---

## 4. Key Functional Requirements

### 4.1 Onboarding & SMS Gateway Engine
- `POST /api/v1/auth/request-otp`: Sends 6-digit OTP via **SMSGATE**, saves bcrypted OTP in cache/DB with 3-minute expiration.
- `POST /api/v1/auth/verify-otp`: Compares submitted OTP with bcrypted hash. On success, sets `httpOnly` cookie with `maxAge = 20 * 60 * 1000`.

### 4.2 User Profile & Voting Dashboard
- `GET /api/v1/user/profile`: Returns voter profile, session time remaining, `hasVoted` status, and voted project details (if voted).
- `PUT /api/v1/user/profile`: Allows voter to update display name.
- `POST /api/v1/votes/cast`: Casts voter's single vote for selected project. Immediately updates voter profile to show voted team.

### 4.3 Admin Control Panel & Management Engine
- **Project CRUD Engine (`/api/v1/admin/projects`):** Create, Read, Update, Delete project booth entries.
- **User Management Engine (`/api/v1/admin/users`):** View voter list, block/unblock numbers, view vote timestamps.
- **Scheduled Result Reveal:** Results hidden until `result_reveal_at` or manual publish trigger.

---

## 5. System Architecture & Tech Stack

### 5.1 Technology Stack
- **Frontend Framework:** React.js (v19+) bundled with Vite
- **Styling Framework:** TailwindCSS (configured with `#C12A37` brand tokens)
- **Frontend State Management:** React `useReducer` + Context API
- **Performance Optimization:** Lazy Loading (`React.lazy` + `Suspense`)
- **QR Code Engine:** `qrcode.react` (for booth signage & voter sharing)
- **Backend Framework & Runtime:** Node.js (v20+) with Express.js
- **Database Engine:** MongoDB with Mongoose ODM
- **Security & Session:** Bcrypted OTPs, `httpOnly` 20-minute session cookies
- **SMS Gateway:** SMSGATE REST Client
- **Detailed Tech Architecture:** See [`docs/TechStack.md`](file:///home/prashant/Documents/InnoVote-2.0/docs/TechStack.md)

---

## 6. API Specification

### Authentication & Profile Endpoints
- `POST /api/v1/auth/request-otp`
  - **Body:** `{ "phoneNumber": "+97798XXXXXXXX" }`
  - **Response:** `{ "success": true, "message": "OTP sent via SMSGATE." }`
- `POST /api/v1/auth/verify-otp`
  - **Body:** `{ "phoneNumber": "+97798XXXXXXXX", "otp": "482910" }`
  - **Set-Cookie Header:** `innovote_session=<JWT>; HttpOnly; Path=/; Max-Age=1200; SameSite=Strict`
  - **Response:** `{ "success": true, "user": { "phoneHash": "...", "hasVoted": false } }`
- `GET /api/v1/user/profile` (Cookie Auth)
  - **Response:** `{ "success": true, "profile": { "displayName": "Alex", "hasVoted": true, "votedProject": { "title": "Team Apex", "boothNumber": "12" } } }`

### Voting Endpoints
- `POST /api/v1/votes/cast` (Cookie Auth)
  - **Body:** `{ "projectId": "60d5..." }`
  - **Response:** `{ "success": true, "message": "Vote recorded!", "votedProject": { "title": "Team Apex", "boothNumber": "12" } }`

---

## 7. UI Design System & Brand Palette

- **Primary Brand Color:** `#C12A37` (Crimson Red / Ruby Core)
- **Primary Hover & Active:** `#9E1F2A` (Hover) / `#7B151F` (Active / Pressed)
- **Supporting Accents:** Slate Neutrals (`#64748B`, `#94A3B8`)
- **Full Reference Documentation:** See [`docs/Colors.md`](file:///home/prashant/Documents/InnoVote-2.0/docs/Colors.md)
