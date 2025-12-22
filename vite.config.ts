import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-three-core': ['three'],
          'vendor-three-fiber': ['@react-three/fiber', '@react-three/drei'],
          'vendor-utils': ['axios', 'zustand', 'zod'],
          'vendor-auth': ['js-cookie', 'jwt-decode', 'react-secure-storage'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
