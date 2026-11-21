import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 3500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('prismjs') || id.includes('marked')) {
              return 'vendor-markdown';
            }
            if (id.includes('minisearch')) {
              return 'vendor-search';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            return 'vendor-other';
          }
        }
      }
    }
  }
})
