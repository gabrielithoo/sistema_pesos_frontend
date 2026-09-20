import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  base: '/sistema_pesos_frontend/', 
})
