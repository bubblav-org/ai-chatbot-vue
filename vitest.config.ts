import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    root: resolve(__dirname, 'src'),
    include: ['**/__tests__/*.test.ts'],
    setupFiles: [resolve(__dirname, 'src/__tests__/setup.ts')],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
