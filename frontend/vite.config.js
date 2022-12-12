import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	server: {
		host: true
	},
	plugins: [sveltekit()]
};

export default config;
