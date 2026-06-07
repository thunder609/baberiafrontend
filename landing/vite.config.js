import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 4201,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
