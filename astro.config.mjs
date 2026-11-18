import { defineConfig } from 'astro/config';

export default defineConfig({
  server: { host: '0.0.0.0' },
  vite: { server: { allowedHosts: ['.e2b.app'] } },
  devToolbar: { enabled: false },
});
