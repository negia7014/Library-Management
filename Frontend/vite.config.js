// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Front-end se aayi har /api request ko 4000 par bhejega
        target: 'http://localhost:5000', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
});