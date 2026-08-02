# RemoteRecruit 🌍

A modern, fully responsive **global remote job board** platform with a full-stack implementation — a React.js + Tailwind CSS frontend backed by an Express + MongoDB Atlas API.

## 🚀 Live Demo

# https://remote-recruitt.vercel.app

## ✨ Features

### Frontend
- **Fully Responsive Design** — Optimized for desktop, tablet, and mobile
- **React.js Component Architecture** — Modular, reusable, and maintainable
- **Tailwind CSS v4 Styling** — Utility-first CSS with custom design tokens
- **Framer Motion Animations** — Smooth entrance animations, scroll-triggered reveals, and floating elements
- **Interactive UI Elements** — Accordion FAQ, navigation menu, form inputs, and filter controls
- **Hover Effects & Transitions** — Button scaling, link color shifts, and card elevation changes
- **FAQ Accordion** — Expandable/collapsible questions with animated transitions
- **Mobile Friendly Layout** — Hamburger menu, stacked grids, and touch-target sizing
- **Accessibility Best Practices** — Semantic HTML, ARIA labels, keyboard-navigable controls
- **Multi-Page Routing** — Home, Sign In, Sign Up, and protected Dashboard routes
- **Scroll-Aware Navbar** — Transparent at top, solid backdrop on scroll with auth-aware user state

### Backend
- **User Authentication** — Register / login with JWT tokens and bcrypt password hashing
- **Email Verification** — New accounts are verified before login is allowed, with resend + rate limiting. Verification emails are sent via **Nodemailer + Gmail SMTP** using a dedicated Gmail account with an App Password
- **Role-Based Access Control** — `user` and `admin` roles
- **Job Posting** — Any logged-in user can post a job
- **Job Editing** — Only the job poster (or admin) can edit a post
- **Job Deletion** — Admin-only endpoint
- **Search & Filter** — Query jobs by title/company, category, and employment type
- **Protected Routes** — Frontend routes guarded by authentication

## 🛠️ Tech Stack

### Frontend
| Technology     | Purpose                 |
| -------------- | ----------------------- |
| React.js 19    | UI library              |
| Vite 8         | Build tool & dev server |
| Tailwind CSS 4 | Utility-first styling   |
| Framer Motion 12 | Animation library    |
| React Icons    | Icon components         |
| React Router 7 | Client-side routing     |

### Backend
| Technology  | Purpose                 |
| ----------- | ----------------------- |
| Node.js     | Runtime                 |
| Express     | HTTP server & routing   |
| MongoDB Atlas | NoSQL database        |
| Mongoose    | ODM / data modeling     |
| JWT         | Authentication tokens   |
| bcryptjs    | Password hashing        |

## 📁 Project Structure

```
├── src/                    # Frontend (React + Vite)
│   ├── api/
│   │   └── client.js       # Fetch wrapper + API layer
│   ├── components/
│   │   ├── CTA.jsx         # Call-to-action section
│   │   ├── FAQ.jsx         # Accordion FAQ
│   │   ├── Feature.jsx     # Feature showcase
│   │   ├── FeatureBlocks.jsx # Membership pricing card
│   │   ├── Footer.jsx      # Footer with pricing + social
│   │   ├── Hero.jsx        # Hero section
│   │   ├── JobForm.jsx     # Post/edit job modal
│   │   ├── Navbar.jsx      # Auth-aware navigation
│   │   └── SignUpAdd.jsx   # Job dashboard (live data)
│   ├── context/
│   │   ├── authContext.js  # Auth context + useAuth hook
│   │   └── AuthContext.jsx # Auth provider
│   ├── pages/
│   │   ├── Home.jsx        # Landing page assembly
│   │   ├── SignIn.jsx      # Sign in form
│   │   └── SignUp.jsx      # Sign up form
│   ├── App.jsx             # Routes + protected routes
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind theme & base styles
│
└── server/                 # Backend (Express + MongoDB)
    ├── config/
    │   └── db.js           # MongoDB connection
    ├── controllers/
    │   ├── authController.js # register / login / me
    │   └── jobController.js  # job CRUD + permissions
    ├── middleware/
    │   └── auth.js         # JWT protect + adminOnly
    ├── models/
    │   ├── User.js         # User schema (role, hashed pw)
    │   └── Job.js          # Job schema
    ├── routes/
    │   ├── authRoutes.js
    │   └── jobRoutes.js
    ├── .env                # Mongo URI + JWT secret
    └── server.js           # Express entry point
```

## 🔌 API Reference

| Method | Endpoint           | Auth         | Description                    |
| ------ | ------------------ | ------------ | ------------------------------ |
| POST   | `/api/auth/register` | Public      | Create an account              |
| POST   | `/api/auth/login`    | Public      | Login, returns JWT token       |
| GET    | `/api/auth/me`       | User        | Get current user profile       |
| GET    | `/api/jobs`          | Public      | List jobs (search/filter)      |
| GET    | `/api/jobs/:id`      | Public      | Get a single job               |
| GET    | `/api/jobs/mine`     | User        | Get current user's jobs        |
| POST   | `/api/jobs`          | User        | Post a new job                 |
| PUT    | `/api/jobs/:id`      | Poster/Admin | Edit a job post               |
| DELETE | `/api/jobs/:id`      | Admin       | Delete a job post              |

## 🧪 Installation

### Prerequisites
- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Install frontend dependencies

```bash
git clone <repository-url>
cd remote-recruit
npm install
```

### 2. Configure the backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and add your MongoDB Atlas credentials:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/remote_recruit?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
PORT=5000
```

### 3. Configure email verification

Copy `server/.env.example` to `server/.env` (in addition to your MongoDB/JWT settings above). Verification emails are sent from a dedicated Gmail account via **Nodemailer + Gmail SMTP**:

1. Use a dedicated Gmail account, or your own, and enable **2-step verification**.
2. Create an **App Password** at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Put the Gmail address and the app password in `server/.env`:
   ```env
   EMAIL_USER=you@gmail.com
   EMAIL_PASS=your_16_char_app_password
   ```
   The mailer uses `smtp.gmail.com:587` by default. Use the App Password, **not** your Gmail login password.
4. Restart the backend. On boot it verifies the SMTP connection — look for `✅ Mailer: SMTP connection verified (smtp.gmail.com:587)`.

**Local development without real email:** the included mail sink (`server/scripts/dev-mail-server.mjs`) captures emails locally. `npm run dev:all` starts it automatically (web + api + mail) — just replace `EMAIL_USER`/`EMAIL_PASS` with `dev`/`dev` and uncomment the `SMTP_HOST=localhost` / `SMTP_PORT=1025` lines in `server/.env`. Sent verification emails appear in the `mail` terminal.

**How it works:** after registration the backend generates a cryptographically secure token (`crypto.randomBytes(32)`), stores it with a 24-hour expiry in MongoDB, and emails a "Verify Email" button pointing to `/verify-email/:token`. Clicking it validates the token, sets the account verified, and clears the token. Invalid/expired links land on a failure page that lets the user resend. Login is blocked until the email is verified, and resend requests are rate-limited.

### 4. Run the app

```bash
# Terminal 1 — backend
cd server
npm run dev        # http://localhost:5000

# Terminal 2 — frontend
cd ..
npm run dev        # http://localhost:5173
```

Or run both at once from the project root:

```bash
npm run dev:all
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`.

## 👑 Making a User Admin

Promote your account to admin by updating your role in MongoDB Atlas:

```javascript
// In MongoDB Atlas, update the users collection:
db.users.updateOne(
  { email: "you@example.com" },
  { $set: { role: "admin" } }
)
```

## 📦 Build

```bash
npm run build
```

Output is generated in the `dist/` directory and is ready for deployment.

## 🔍 Lint

```bash
npm run lint
```

## 🎨 Design System

The project uses a custom Tailwind CSS theme defined in `src/index.css`:

| Token                    | Value     | Usage                         |
| ------------------------ | --------- | ----------------------------- |
| `remote-blue`            | `#0a0e2a` | Primary dark background       |
| `remote-purple`          | `#6c3bf1` | Accent purple                 |
| `remote-accent`          | `#ff6b35` | Orange accent                 |
| `nav-start` / `nav-end`  | `#234a9f` / `#2c56b3` | Navbar gradient |
| `footer-start` / `mid` / `end` | `#3D79C3` / `#2E63B2` / `#234F9D` | Footer gradient |
| `footer-logo`            | `#6BE0F8` | Footer brand cyan             |
| `signup-bg` / `signup-text` | `#dbeafe` / `#1d4ed8` | Sign Up button |
