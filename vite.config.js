import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/student-login-frontend/', // Base url for GH Pages https://dev.to/shashannkbawa/deploying-vite-app-to-github-pages-3ane
  plugins: [react()],
})
