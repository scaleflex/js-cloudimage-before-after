import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, '../src/index.ts'),
      name: 'CIBeforeAfter',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'js-cloudimage-before-after.esm.js';
        if (format === 'cjs') return 'js-cloudimage-before-after.cjs.js';
        return 'js-cloudimage-before-after.min.js';
      },
    },
    outDir: resolve(__dirname, '../dist'),
    emptyOutDir: false,
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        exports: 'named',
      },
    },
  },
});
