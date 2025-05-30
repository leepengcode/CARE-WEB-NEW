import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: '192.168.0.107', // IP address of your machine on the LAN
    port: 5173,             // Or any other port you want
  }
})
