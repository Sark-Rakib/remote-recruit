# RemoteRecruit 🌍

A modern, fully responsive landing page for a global remote job board platform. Built with React.js and Tailwind CSS, featuring smooth animations, interactive UI components, and a clean component-based architecture.

## 🚀 Live Demo

*(https://remote-recruite.netlify.app)*

## ✨ Features

- **Fully Responsive Design** — Optimized for desktop, tablet, and mobile
- **React.js Component Architecture** — Modular, reusable, and maintainable
- **Tailwind CSS v4 Styling** — Utility-first CSS with custom design tokens
- **Framer Motion Animations** — Smooth entrance animations, scroll-triggered reveals, and floating elements
- **Interactive UI Elements** — Accordion FAQ, navigation menu, form inputs, and filter controls
- **Hover Effects & Transitions** — Button scaling, link color shifts, and card elevation changes
- **FAQ Accordion** — Expandable/collapsible questions with animated transitions
- **Mobile Friendly Layout** — Hamburger menu, stacked grids, and touch-target sizing
- **Accessibility Best Practices** — Semantic HTML, ARIA labels, keyboard-navigable controls
- **Multi-Page Routing** — Home, Sign In, Sign Up, and Dashboard routes
- **Scroll-Aware Navbar** — Transparent at top, solid backdrop on scroll with dark/light adaptation

## 🛠️ Tech Stack

| Technology   | Purpose                    |
| ------------ | -------------------------- |
| React.js 19  | UI library                 |
| Vite 8       | Build tool & dev server    |
| Tailwind CSS 4 | Utility-first styling   |
| Framer Motion 12 | Animation library      |
| React Icons  | Icon components            |
| React Router 7 | Client-side routing     |

## 📁 Project Structure

```
src/
├── components/
│   ├── CTA.jsx          # Call-to-action section
│   ├── FAQ.jsx          # Accordion FAQ
│   ├── Feature.jsx      # Feature showcase
│   ├── FeatureBlocks.jsx # Membership pricing card
│   ├── Footer.jsx       # Footer with pricing + social
│   ├── Hero.jsx         # Hero section
│   ├── Navbar.jsx       # Scroll-aware navigation
│   └── SignUpAdd.jsx    # Job dashboard mockup
├── pages/
│   ├── Home.jsx         # Landing page assembly
│   ├── SignIn.jsx       # Sign in form
│   └── SignUp.jsx       # Sign up form
├── App.jsx              # Route definitions
├── main.jsx             # Entry point
└── index.css            # Tailwind theme & base styles
```

## 📄 Pages & Routes

| Route        | Page          | Description               |
| ------------ | ------------- | ------------------------- |
| `/`          | Home          | Landing page with all sections |
| `/signin`    | SignIn        | Sign in form              |
| `/signup`    | SignUp        | Sign up form              |
| `/signupadd` | SignUpAdd     | Job marketplace dashboard |

## 🧪 Installation

```bash
# Clone the repository
git clone <https://github.com/Sark-Rakib/remote-recruit.git>

# Navigate to the project directory
cd remote-recruit

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

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

| Token                  | Value     | Usage                      |
| ---------------------- | --------- | -------------------------- |
| `remote-blue`          | `#0a0e2a` | Primary dark background    |
| `remote-purple`        | `#6c3bf1` | Accent purple              |
| `remote-accent`        | `#ff6b35` | Orange accent              |
| `nav-start` / `nav-end`| `#234a9f` / `#2c56b3` | Navbar gradient |
| `footer-start` / `mid` / `end` | `#3D79C3` / `#2E63B2` / `#234F9D` | Footer gradient |
| `footer-logo`          | `#6BE0F8` | Footer brand cyan          |
| `signup-bg` / `signup-text` | `#dbeafe` / `#1d4ed8` | Sign Up button |
