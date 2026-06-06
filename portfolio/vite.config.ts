import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    fs: {
      allow: ['..', 'C:/Users/sansk/.gemini/antigravity-ide/brain/f0fd32b9-e58e-4cfd-9679-6eee1dbc78d1']
    }
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './public/assets'),
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
});
// Trigger restart
