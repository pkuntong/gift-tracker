/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_STRIPE_SECRET_KEY: string
  // Add any other VITE_ variables you use here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 