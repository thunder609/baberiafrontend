import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  envDir: '..',
  plugins: [tailwindcss()],
  server: {
    port: 4201,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
