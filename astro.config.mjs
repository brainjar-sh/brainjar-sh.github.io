// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://brainjar.sh',
	integrations: [
		starlight({
			title: '{ brainjar }',
			tagline: 'Shape how your AI thinks',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/brainjar-sh/cli' },
			],
			customCss: ['./src/styles/custom.css'],
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: 'https://brainjar-sh.github.io/og.png' },
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
						{ label: 'Migrating from Monolithic Prompts', slug: 'guides/migration' },
						{ label: 'Subagent Orchestration', slug: 'guides/subagents' },
						{ label: 'Orchestration Patterns', slug: 'guides/orchestration-patterns' },
						{ label: 'Packs', slug: 'guides/packs' },
						{ label: 'Hooks', slug: 'guides/hooks' },
						{ label: 'Authoring with AI', slug: 'guides/authoring-with-ai' },
						{ label: 'Recipes', slug: 'guides/recipes' },
					],
				},
				{ label: 'CLI Reference', slug: 'reference/cli' },
			],
		}),
	],
});
