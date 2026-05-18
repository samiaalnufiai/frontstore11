import { defineConfig } from 'vite';
import path from 'path';

const entry = process.env.ENTRY || 'main';

const entries = {
  main: path.resolve(__dirname, 'assets/js/main.js'),
  cart: path.resolve(__dirname, 'assets/js/cart/controller.js'),
};

export default defineConfig({
  build: {
    outDir: 'assets/dist',
    emptyOutDir: false,
    lib: {
      entry: entries[entry],
      name: entry === 'cart' ? 'CartController' : 'Theme',
      fileName: () => `${entry === 'cart' ? 'cart-controller' : 'theme'}.js`,
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: entry === 'cart' ? 'cart-controller.js' : 'theme.js',
      },
    },
    minify: process.env.NODE_ENV === 'production',
    sourcemap: process.env.NODE_ENV !== 'production',
  },
});
