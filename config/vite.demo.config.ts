import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, '../demo'),
  build: {
    outDir: resolve(__dirname, '../docs'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      'js-cloudimage-before-after': resolve(__dirname, '../src/index.ts'),
    },
  },
});
