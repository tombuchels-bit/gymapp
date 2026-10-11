import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const base = '/gymapp/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'GoonFitness',
        short_name: 'GoonFitness',
        description: 'Jouw persoonlijke trainingslogboek',
        lang: 'nl',
        theme_color: '#0b0d0c',
        background_color: '#0b0d0c',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [{ src: `${base}icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: { navigateFallback: 'index.html' },
    }),
  ],
});
