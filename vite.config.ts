import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
// Note: For a production app, you would install and use the vite-plugin-pwa package

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // This is where you would add the PWA plugin in a production app
    // For example: VitePWA({ ... options ... })
  ],
  root: '.',
  base: '/',

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    },
  },
  // Copy service worker and manifest to dist folder during build
  publicDir: 'public',
  server: {
    port: 5173,
    open: true,
    strictPort: false, // Allow Vite to try different ports if 5173 is in use
    // Security measures for development
    fs: {
      strict: false, // Allow more flexible file serving
      allow: ['.', '../node_modules'], // Allow node_modules access
      deny: ['.env', '.env.*', '*.{pem,crt,key}'], // Deny sensitive files
    },
    cors: true, // Enable CORS in development
    hmr: true, // Just use default HMR settings
watch: {
      usePolling: false, // Don't use polling as it can cause high CPU usage and slower response times
    }
  },
}) 