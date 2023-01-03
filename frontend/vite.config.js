import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';

/** @type {import('vite').UserConfig} */
const config = {
	server: {
		host: true,
		https: {
			key: fs.readFileSync('./.cert/key.pem'),
			cert: fs.readFileSync('./.cert/cert.pem'),
		},
	},
	plugins: [sveltekit()]
};

export default config;
