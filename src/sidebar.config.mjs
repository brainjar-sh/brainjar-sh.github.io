// Single source of truth for the docs sidebar.
// Imported by astro.config.mjs (Starlight) and scripts/generate-llms-txt.mjs.

export const sidebar = [
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
			{ label: 'Procedures', slug: 'concepts/procedures' },
			{ label: 'Skills', slug: 'concepts/skills' },
			{ label: 'Brains', slug: 'concepts/brains' },
		],
	},
	{
		label: 'Guides',
		items: [
			{ label: 'Configuration', slug: 'guides/configuration' },
			{ label: 'Platforms', slug: 'guides/platforms' },
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
		// Single-page CLI reference generated from the latest brainjar release
		// (see scripts/fetch-cli-docs.sh). All commands live in one page with an
		// in-page TOC, so the sidebar has one entry rather than 69.
		label: 'CLI Reference',
		slug: 'reference/cli',
	},
];
