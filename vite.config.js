import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig(({ mode }) => ({
  plugins: [svelte()],
  base: mode === 'production' ? '/spontaneous_shrine/' : '/',
  server: {
    host: true,
    allowedHosts: ['alanyeh.ngrok.pizza'],
  },
}))
