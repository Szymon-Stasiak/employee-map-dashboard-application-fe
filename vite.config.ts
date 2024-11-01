import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:80/',
        rewrite: (path: string) => path.replace('/api', ''),
      },
    },
    host: true,
    strictPort: true,
    port: 5173,
  },
  plugins: [react()],
});
