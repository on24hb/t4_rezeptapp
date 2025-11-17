import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'node:fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Deno linter struggles with import.meta.url, but Vite/tsc are fine.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    https: {
      key: fs.readFileSync('../server/localhost-key.pem'),
      cert: fs.readFileSync('../server/localhost.pem'),
    },
    port: 5173,
  },
})
