import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - React & friends
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }

          // Animation libraries
          if (id.includes('framer-motion') || id.includes('motion') || id.includes('gsap')) {
            return 'motion-vendor';
          }

          // Three.js core
          if (id.includes('three') && !id.includes('@react-three')) {
            return 'three-core';
          }

          // React Three Fiber ecosystem (sangat berat!)
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei') || id.includes('@react-three/rapier')) {
            return 'r3f-vendor';
          }

          // Spline (berat juga!)
          if (id.includes('@splinetool/react-spline') || id.includes('@splinetool/runtime')) {
            return 'spline-vendor';
          }

          // Icons & UI
          if (id.includes('react-icons') || id.includes('lucide-react') || id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'ui-vendor';
          }

          // Mesh utilities
          if (id.includes('meshline')) {
            return 'mesh-vendor';
          }

          // PDF libraries
          if (id.includes('react-pdf') || id.includes('pdfjs-dist')) {
            return 'pdf-vendor';
          }
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Optimize minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log di production
        drop_debugger: true,
      },
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'three',
    ],
    exclude: [
      '@splinetool/runtime', // Exclude heavy runtime
    ],
  },
})
