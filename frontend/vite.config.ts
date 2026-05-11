import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import checker from 'vite-plugin-checker'
import { VitePWA } from 'vite-plugin-pwa'

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
    https: {
      key: readFileSync('/app/certs/172.23.169.31+3-key.pem'),
      cert: readFileSync('/app/certs/172.23.169.31+3.pem'),
    },
    proxy: {
      '/api': { target: 'http://nginx:80', changeOrigin: true },
      '/sanctum': { target: 'http://nginx:80', changeOrigin: true },
      '/broadcasting': { target: 'http://nginx:80', changeOrigin: true },
      '/app': { target: 'ws://reverb:6001', ws: true, changeOrigin: true },
    },
  },
})
