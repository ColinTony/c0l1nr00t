import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://c0l1nr00t.netlify.app', // Placeholder, update with real domain
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'dracula', // "underground hacker" vibe
      wrap: true,
    },
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
        prefixDefaultLocale: true, // We want /es/ and /en/ explicitly as per requirements
        redirectToDefaultLocale: false // We will handle root redirect manually or let it be
    }
  },
  // We are using manual routing for full control as requested, but defining i18n here helps sitemap
});
