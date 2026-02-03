import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/SKM_CelebrityNote/',   // ← very important! Matches your repo name
})
