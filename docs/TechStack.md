# InnoVote 2.0 — Technology Stack & Engineering Architecture

**Project:** InnoVote 2.0 — Sunway Innovation Fest  
**Target Platform:** Web Application (Mobile-Optimized & Admin Dashboard)

---

## 1. Overview of Technology Stack

| Layer / Concern | Technology | Purpose & Implementation Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **React.js** (v19+ with Vite) | Single Page Application (SPA) providing sub-second interactive rendering for voters and event admins. |
| **Styling & Design System** | **TailwindCSS** (v3+) | Utility-first CSS framework configured with custom `#C12A37` brand tokens, glassmorphism utilities, and dark/light mode themes. |
| **State Management** | **React `useReducer` + Context API** | Predictable state management for passwordless OTP verification, user profile setup, and voting dashboard state. |
| **Code Splitting & Performance** | **Lazy Loading (`React.lazy` + `Suspense`)** | Route-level and component-level lazy loading (Admin Dashboard, Profile View, Results Screen) to ensure fast initial page load. |
| **QR Code Engine** | **QR Generator (`qrcode.react`)** | Generates dynamic QR codes for each participant project booth for easy voter scanning. |
| **Backend Runtime & API** | **Node.js + Express.js** | High-throughput REST API server handling passwordless auth, project CRUD, voting transactions, and SMS dispatches. |
| **Database** | **MongoDB** (with Mongoose ODM) | Document database for Project schemas, User profiles, Bcrypted OTP logs, and Single-Vote records. |
| **Security & Session** | **Bcrypt OTP + `httpOnly` Cookie** | OTP passcodes hashed with `bcrypt` (3-minute TTL). Sessions maintained via secure `httpOnly` cookies with **20-minute MaxAge**. |
| **SMS Gateway Interface** | **SMSGATE** | Integration service for dispatching 6-digit OTP verification passcodes to voter mobile phones. |

---

## 2. Passwordless Auth & Session Architecture

### 2.1 OTP Generation & Bcrypt Hashing
When a user requests OTP authentication:
1. Backend generates a cryptographically secure 6-digit numeric OTP.
2. Hashed OTP is created using `bcrypt.hash(otp, 10)` and stored in Redis / MongoDB with a **180-second (3-minute) TTL**.
3. Plain OTP is sent to the voter's mobile phone via SMSGATE.

```javascript
// controllers/authController.js
import bcrypt from 'bcrypt';
import { sendOtpSms } from '../services/smsGateService.js';
import OtpModel from '../models/Otp.js';

export async function requestOtp(req, res) {
  const { phoneNumber } = req.body;
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otpCode, 10);

  // Store hashed OTP with 3-minute expiry
  await OtpModel.create({
    phoneNumber,
    hashedOtp,
    expiresAt: new Date(Date.now() + 3 * 60 * 1000)
  });

  // Dispatch SMS
  await sendOtpSms(phoneNumber, otpCode);
  return res.json({ success: true, message: 'OTP sent via SMSGATE.' });
}
```

### 2.2 20-Minute `httpOnly` Cookie Session
On OTP verification, server sets a secure `httpOnly` cookie with a **20-minute lifespan** (`maxAge = 20 * 60 * 1000`):

```javascript
export async function verifyOtp(req, res) {
  const { phoneNumber, otp } = req.body;
  const otpRecord = await OtpModel.findOne({ phoneNumber }).sort({ createdAt: -1 });

  if (!otpRecord || new Date() > otpRecord.expiresAt) {
    return res.status, 400).json({ error: 'OTP expired or invalid.' });
  }

  const isMatch = await bcrypt.compare(otp, otpRecord.hashedOtp);
  if (!isMatch) {
    return res.status(400).json({ error: 'Incorrect OTP.' });
  }

  // Issue JWT session token in httpOnly cookie
  const sessionToken = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '20m' });

  res.cookie('innovote_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 20 * 60 * 1000 // 20 minutes
  });

  return res.json({ success: true, message: 'Authenticated successfully.' });
}
```

---

## 3. Frontend Architecture (React 19 + Vite + `useReducer`)

### 3.1 Voter State Reducer (`useReducer`)

```typescript
export interface UserProfileState {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  displayName: string;
  hasVoted: boolean;
  votedProject: {
    id: string;
    title: string;
    boothNumber: string;
  } | null;
  sessionRemainingMs: number;
}

export type ProfileAction =
  | { type: 'LOGIN_SUCCESS'; payload: { phoneNumber: string; hasVoted: boolean; votedProject?: any } }
  | { type: 'UPDATE_NAME'; payload: { displayName: string } }
  | { type: 'VOTE_CAST_SUCCESS'; payload: { project: any } }
  | { type: 'SESSION_EXPIRED' };
```

---

## 4. MongoDB Data Models (Mongoose)

### 4.1 User Schema (`models/User.js`)
```javascript
const userSchema = new mongoose.Schema({
  phoneHash: { type: String, required: true, unique: true, index: true },
  displayName: { type: String, default: 'Voter' },
  hasVoted: { type: Boolean, default: false },
  votedProjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  votedAt: { type: Date, default: null },
  status: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE' }
}, { timestamps: true });
```

### 4.2 Vote Schema (`models/Vote.js`)
```javascript
const voteSchema = new mongoose.Schema({
  roundId: { type: mongoose.Schema.Types.ObjectId, ref: 'VotingRound', required: true, index: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  voterPhoneHash: { type: String, required: true, index: true },
  ipAddress: { type: String }
}, { timestamps: true });

// Strict unique index: 1 vote per phone number per voting round
voteSchema.index({ roundId: 1, voterPhoneHash: 1 }, { unique: true });
```

---

## 5. Directory & Package Structure

```
InnoVote-2.0/
├── client/                     # React 19 + Vite + TailwindCSS Frontend
│   ├── public/                 # Sunway Shield icons & logo SVGs
│   ├── src/
│   │   ├── components/         # ProjectCard, VotingProfileModal, QRGenerator
│   │   ├── context/            # ProfileContext & VotingReducer
│   │   ├── views/              # Lazy-loaded pages (VotingProfile, Admin, Results)
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                     # Express.js + Node.js + MongoDB Backend
    ├── controllers/            # AuthController, ProfileController, VoteController
    ├── middleware/             # cookieAuthMiddleware.js (20-min validator)
    ├── models/                 # Mongoose Data Schemas (User, Project, Vote, Otp)
    ├── services/               # smsGateService.js, hashService.js
    └── server.js
```
