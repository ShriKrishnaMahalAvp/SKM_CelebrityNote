import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/SKM_CelebrityNote/',  // ← Must be EXACTLY this: repo name with / at start and end. Case-sensitive!
})
