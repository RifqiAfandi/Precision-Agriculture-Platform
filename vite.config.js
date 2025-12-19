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
        manualChunks: {
          // Vendor chunks - split large libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-charts': ['recharts'],
          'vendor-map': ['maplibre-gl'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
          ],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
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
      'es-toolkit',
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
