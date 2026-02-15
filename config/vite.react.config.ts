import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, '../src/react/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'index.js';
        return 'index.cjs';
      },
    },
    outDir: resolve(__dirname, '../dist/react'),
    emptyOutDir: true,
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      external: (id) => {
        // Externalize react
        if (id === 'react' || id === 'react-dom' || id.startsWith('react/')) return true;
        // Externalize core library (referenced via relative imports)
        if (id.includes('/core/') || id.includes('/utils/') || id.includes('/styles/')) return true;
        return false;
      },
      output: {
        // Rewrite core imports to the main package
        paths: (id) => {
          if (id.includes('/core/') || id.includes('/utils/') || id.includes('/styles/')) {
            return 'js-cloudimage-before-after';
          }
          return id;
        },
      },
    },
  },
});
