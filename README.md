# ELVIS PORTFOLIO

A modern, interactive portfolio built with React and Vite featuring 3D animations, smooth transitions, and a responsive design. This project showcases projects, certificates, and skills with a sleek dark/light theme toggle.

> ⚠️ **Active Development**. Please respect the original work — do not copy, modify, or redistribute without proper attribution.

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ [React](https://react.dev/) - UI library
- ⚡ [Vite](https://vitejs.dev/) - Lightning-fast build tool with HMR
- 💨 [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- 🎨 [PostCSS](https://postcss.org/) - CSS processing

### Backend & Data

- 🔥 [Supabase](https://supabase.com/) - PostgreSQL + real-time APIs
- 📡 Fetch API for data handling

### Animations & 3D

- 🎬 [Framer Motion](https://www.framer.com/motion/) - Smooth React animations
- 🧊 [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D graphics
- 🎭 [GSAP](https://greensock.com/gsap/) - Advanced animation library
- 🎯 [Spline](https://spline.design/) - 3D model integration

### UI & Icons

- 📦 [Lucide React](https://lucide.dev/) - Modern icons
- 👤 [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- 🔄 [React Router DOM](https://reactrouter.com/) - Client-side routing

### Development

- 🧪 [ESLint](https://eslint.org/) - Code quality assurance
- 🎯 [Tailwind Merge](https://github.com/dcastil/tailwind-merge) - Tailwind class merging

---

## ✨ Features

- 🌓 **Dark/Light Theme Toggle** - Seamless theme switching with persistent state
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🎨 **Smooth Animations** - Framer Motion & GSAP powered transitions
- 🎯 **3D Models** - Integrated Spline 3D assets
- 📊 **Projects Showcase** - Dynamic projects loaded from Supabase
- 🎖️ **Certificates Section** - Display professional achievements
- 💼 **Skills Display** - Organized skill categories
- 📬 **Contact Form** - Integrated contact functionality
- 🚀 **Performance Optimized** - Lazy loading & code splitting
- 🎪 **Interactive UI** - Engaging hover effects and transitions

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/elvis-portfolio.git
   cd elvis-portfolio
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:5173/api
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser

5. **Build for production:**
   ```bash
   npm run build
   ```
   The optimized files will be in the `dist/` folder

---

## 📝 Available Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Create an optimized production build
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Lanyard/        # Lanyard/card related components
│   └── ProfileCard/    # Profile card styling
├── pages/              # Page components (Home, Gallery)
├── contexts/           # React Context (Theme, Navbar)
├── data/               # Static data files
├── lib/                # Utilities & helper functions
├── services/           # API calls & business logic
├── assets/             # Images, fonts, 3D models
└── App.jsx            # Root component
```

---

## 🔧 Configuration

### Tailwind CSS

Customized via [tailwind.config.js](tailwind.config.js) - modify theme colors, fonts, and breakpoints here.

### Vite

Build configuration in [vite.config.js](vite.config.js) - includes React plugin and optimization settings.

### PostCSS

Configured in [postcss.config.js](postcss.config.js) for Tailwind integration.

---

## 🌐 Deployment

This project is ready for deployment on:

- **Vercel** (recommended) - Zero-config deployment
- **Netlify** - Simple Git integration
- **GitHub Pages** - Static hosting
- **Any Node.js Host** - Using `npm run build`

### Vercel Deployment

The [vercel.json](vercel.json) is pre-configured for Vercel hosting.

---

## 📜 License & Copyright

© 2024 Elvis Portfolio. All rights reserved.

🚫 **Unauthorized copying, modification, or redistribution of this project is strictly prohibited without proper attribution and permission from the creator.**

For licensing inquiries or collaborations, please contact the creator directly.

---

## 🤝 Contributing

This is a personal portfolio project. If you'd like to contribute or use parts of this code:

1. Always provide proper attribution
2. Request permission from the creator
3. Link back to the original repository
4. Respect the license

---

## 📧 Contact & Support

For questions, suggestions, or permission requests, please reach out through the contact form in the portfolio or contact the creator directly.

---

**Made with ❤️ by Elvis**
