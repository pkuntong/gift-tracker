import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        app: './index.html'
      }
    },
  },
  server: {
    port: 3000,
    open: true,
    // Security measures for development
    fs: {
      strict: true,
      allow: ['.'], // Restrict file serving to workspace root
      deny: ['.env', '.env.*', '*.{pem,crt,key}'], // Deny sensitive files
    },
    cors: false, // Disable CORS in development
    origin: 'http://localhost:3000', // Restrict origin in development
  },
}) 