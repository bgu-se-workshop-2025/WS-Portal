import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    // Bundle analyzer - generates stats.html after build
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }) as any
  ],
  define: {
    global: 'window',
  },
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React ecosystem
          react: ['react', 'react-dom', 'react-router-dom'],
          
          // Material-UI chunk (likely your largest dependency)
          mui: [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled'
          ]
        }
      }
    },
    
    // Increase chunk size warning limit to 1000kb (optional)
    chunkSizeWarningLimit: 1000,
    
    // Enable source maps for better debugging (optional)
    sourcemap: false
  }
});
