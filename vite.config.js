import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    exclude: [
      'pdfjs-dist', 
      'pdfjs-dist/build/pdf.worker.entry',
      'pdfjs-dist/build/pdf.worker.min.mjs'
    ]
  },
  css: {
    postcss: './postcss.config.js'
  }
})