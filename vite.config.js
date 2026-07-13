import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Use esbuild for minification (faster and built-in)
    minify: 'esbuild',
    // Enable code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Node modules chunking strategy
          if (id.includes('node_modules')) {
            // MapLibre GL - large map library (separate chunk)
            if (id.includes('maplibre-gl')) {
              return 'vendor-map';
            }
            // Recharts and D3 dependencies
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            // React core
            if (id.includes('react-dom') || id.includes('/react/')) {
              return 'vendor-react';
            }
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            // Turf.js geospatial library
            if (id.includes('@turf')) {
              return 'vendor-turf';
            }
            // Firebase - lazy loaded
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            // Other smaller vendor libs
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Remaining node_modules
            return 'vendor-common';
          }
          // Feature-based code splitting for app code
          if (id.includes('/features/agriino/components/kriging')) {
            return 'feature-kriging';
          }
          if (id.includes('/features/agriino/')) {
            return 'feature-agriino';
          }
          if (id.includes('/features/')) {
            return 'features';
          }
        },
      },
    },
    // Increase chunk size warning limit for map library
    chunkSizeWarningLimit: 600,
    // Disable source maps for production
    sourcemap: false,
    // Target modern browsers for smaller bundle
    target: 'esnext',
  },
  // Optimize dependencies - pre-bundle common deps
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'lucide-react',
      'clsx',
      'class-variance-authority',
      'tailwind-merge',
      'sonner',
      'recharts',
    ],
    // Exclude only firebase - load on demand
    exclude: ['firebase'],
    // Use esbuild for faster dep optimization
    esbuildOptions: {
      target: 'esnext',
    },
  },
  // Server optimization for development
  server: {
    // Faster file serving
    fs: {
      strict: false,
    },
  },
  // Faster esbuild options
  esbuild: {
    target: 'esnext',
  },
});
