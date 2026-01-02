import { defineConfig } from 'vite'

export default defineConfig({
  base: '/dice/',
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
