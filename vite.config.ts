import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    commonjsOptions: {
      ignore: ['keytar'],
    },
    rollupOptions: {
      external: ['keytar'],
    },
  },
  resolve: {
    alias: {
      'node:events': 'events',
      'node:stream': 'stream-browserify',
      'node:buffer': 'buffer',
    },
  },
});
