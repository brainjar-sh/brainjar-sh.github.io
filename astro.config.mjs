// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { sidebar } from './src/sidebar.config.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://brainjar.sh',
	integrations: [
		starlight({
			title: '[ brainjar ]',
			tagline: 'Shape how your AI thinks',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/brainjar-sh/brainjar' },
			],
			customCss: ['./src/styles/custom.css'],
			expressiveCode: {
				themes: ['one-dark-pro', 'one-light'],
				styleOverrides: {
					borderRadius: '0',
					borderColor: 'var(--bj-frame)',
					codeFontFamily: 'var(--sl-font-mono)',
					codeFontSize: '0.875rem',
					frames: {
						shadowColor: 'transparent',
					},
				},
			},
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: 'https://brainjar-sh.github.io/og.png' },
				},
				{
					tag: 'script',
					attrs: { src: '/versions.js', defer: true },
				},
			],
			sidebar,
		}),
	],
});
