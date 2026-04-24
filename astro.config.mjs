// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
			sidebar: [
				{ label: 'Getting Started', slug: 'getting-started' },
				{
					label: 'Concepts',
					items: [
						{ label: 'Overview', slug: 'concepts/overview' },
						{ label: 'Why Composable Prompts', slug: 'concepts/why-composable' },
						{ label: 'Architecture', slug: 'concepts/architecture' },
						{ label: 'Souls', slug: 'concepts/souls' },
						{ label: 'Personas', slug: 'concepts/personas' },
						{ label: 'Rules', slug: 'concepts/rules' },
						{ label: 'Brains', slug: 'concepts/brains' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Configuration', slug: 'guides/configuration' },
						{ label: 'MCP Integration', slug: 'guides/mcp' },
						{ label: 'Migrating from Monolithic Prompts', slug: 'guides/migration' },
						{ label: 'Subagent Orchestration', slug: 'guides/subagents' },
						{ label: 'Orchestration Patterns', slug: 'guides/orchestration-patterns' },
						{ label: 'Packs', slug: 'guides/packs' },
						{ label: 'Hooks', slug: 'guides/hooks' },
						{ label: 'Authoring with AI', slug: 'guides/authoring-with-ai' },
						{ label: 'Recipes', slug: 'guides/recipes' },
					],
				},
				{
					// Single-page CLI reference generated from the latest
					// brainjar release (see scripts/fetch-cli-docs.sh). All
					// commands live in one page with in-page TOC, so the
					// sidebar has one entry rather than 69.
					label: 'CLI Reference',
					slug: 'reference/cli',
				},
			],
		}),
	],
});
