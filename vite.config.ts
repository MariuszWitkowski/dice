import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
})
