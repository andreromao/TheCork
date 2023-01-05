import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite'
import fs from 'fs';

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	return {
		server: {
			host: true,
			https: {
				key: fs.readFileSync('./.cert/key.pem'),
				cert: fs.readFileSync('./.cert/cert.pem'),
			},
			proxy: {
				'/api': {
					target: env.API_URL,
					changeOrigin: true,
					secure: false,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
				'/auth': {
					target: env.AUTH_URL,
					changeOrigin: true,
					secure: false,
					rewrite: (path) => path.replace(/^\/auth/, ''),
				},
			},
		},
		plugins: [sveltekit()]
	}
})
