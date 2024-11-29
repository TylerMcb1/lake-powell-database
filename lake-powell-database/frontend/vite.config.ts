import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled', '@mui/system'],
    },
    build: {
    commonjsOptions: {
      include: [/node_modules/], // Include dependencies for CommonJS compatibility
    },
  },
})
