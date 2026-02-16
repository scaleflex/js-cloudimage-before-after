import { defineConfig } from 'vite';
import { resolve } from 'path';
import type { Plugin } from 'vite';

function rewriteMainImport(): Plugin {
  return {
    name: 'rewrite-main-import',
    renderChunk(code) {
      // Rewrite dynamic import("./js-cloudimage-before-after") to import("js-cloudimage-before-after")
      return code.replace(
        /import\(["']\.\/js-cloudimage-before-after["']\)/g,
        'import("js-cloudimage-before-after")',
      );
    },
  };
}

export default defineConfig({
  plugins: [rewriteMainImport()],
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
        // Externalize main package (referenced via ../index or relative core imports)
        if (id.includes('/src/index') || id.includes('/core/') || id.includes('/utils/') || id.includes('/styles/')) return true;
        return false;
      },
      output: {
        paths: (id) => {
          if (id.includes('/src/index') || id.includes('/core/') || id.includes('/utils/') || id.includes('/styles/')) {
            return 'js-cloudimage-before-after';
          }
          return id;
        },
      },
    },
  },
});
