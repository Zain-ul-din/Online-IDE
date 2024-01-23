import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
// https://github.com/vdesjs/vite-plugin-monaco-editor
export default defineConfig({
  plugins: [react()],
})

