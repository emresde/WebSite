// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Actions, Pages'in gercek adresini SITE_URL ve BASE_PATH olarak verir
// (bkz. .github/workflows/deploy.yml). Yerelde ikisi de bos kalir.
export default defineConfig({
  site: process.env.SITE_URL || 'https://emresde.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
