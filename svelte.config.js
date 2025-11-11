/*
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

//** @type {import('@sveltejs/kit').Config}
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// Esto asegura que los archivos estáticos y compilados se incluyan
			assets: {
				from: './static',
				to: './build/client'
			},
			out: 'build'
		})
	}
};

export default config;
*/

import cloudflare from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: cloudflare({
      // Configuración explícita para evitar el bug
      routes: {
        include: ['/*'],
        exclude: ['/images/*', '/robots.txt', '/theme.js']
      },
      platformProxy: {
        configPath: 'wrangler.toml',
        persist: true
      }
    })
  }
};
