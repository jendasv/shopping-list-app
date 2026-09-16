import { fileURLToPath, URL } from 'node:url'
import { existsSync, readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import checker from 'vite-plugin-checker'
import { VitePWA } from 'vite-plugin-pwa'

// Local HTTPS is only needed to test the barcode scanner's camera access from
// a real phone on the LAN (see Readme.md "HTTPS in dev"); on a fresh clone,
// or on localhost/desktop, these certs won't exist and the dev server just
// falls back to plain HTTP.
const certKeyPath = '/app/certs/key.pem'
const certPath = '/app/certs/cert.pem'
const httpsConfig =
  existsSync(certKeyPath) && existsSync(certPath)
    ? { key: readFileSync(certKeyPath), cert: readFileSync(certPath) }
    : undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    checker({ vueTsc: true }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'favicon.ico'],
      manifest: {
        name: 'Shopping List',
        short_name: 'Lists',
        description: 'Shared household lists — shopping, packing and more.',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cache app shell (HTML, JS, CSS, fonts)
        globPatterns: ['**/*.{js,css,html,svg,ico,woff,woff2}'],
        // Stale-while-revalidate for navigation (SPA fallback)
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/sanctum/, /^\/email/],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: true,
    allowedHosts: true,
    https: httpsConfig,
    proxy: {
      '/api': { target: 'http://nginx:80', changeOrigin: true },
      '/sanctum': { target: 'http://nginx:80', changeOrigin: true },
      '/broadcasting': { target: 'http://nginx:80', changeOrigin: true },
      '/app': { target: 'ws://reverb:6001', ws: true, changeOrigin: true },
    },
  },
})
