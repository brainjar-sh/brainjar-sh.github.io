#!/usr/bin/env node
// Generate public/llms.txt from the docs sidebar + each page's frontmatter.
// Runs as part of `npm run build` so the file stays in sync with the docs.
//
// Output follows the llms.txt convention (https://llmstxt.org/): a top-level
// project intro, optional sections, and bullet links. Every doc is also
// available as raw markdown at <url>.md (see scripts/copy-raw-md.sh).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sidebar } from '../src/sidebar.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS = join(ROOT, 'src', 'content', 'docs');
const OUT = join(ROOT, 'public', 'llms.txt');
const SITE = 'https://brainjar.sh';

function readFrontmatter(slug) {
	for (const ext of ['.md', '.mdx']) {
		const p = join(DOCS, slug + ext);
		if (!existsSync(p)) continue;
		const raw = readFileSync(p, 'utf8');
		const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
		if (!m) return {};
		const fm = {};
		for (const line of m[1].split(/\r?\n/)) {
			const km = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
			if (km) fm[km[1]] = km[2].replace(/^["']|["']$/g, '').trim();
		}
		return fm;
	}
	throw new Error(`Doc not found for slug: ${slug}`);
}

function bullet(slug, label) {
	const fm = readFrontmatter(slug);
	const title = label || fm.title || slug;
	const desc = fm.description ? `: ${fm.description}` : '';
	return `- [${title}](${SITE}/${slug}.md)${desc}`;
}

const out = [];
const push = (...lines) => out.push(...lines);

push('# brainjar', '');
push('> Shape how your AI thinks — composable soul, persona, rules, procedure, and skill for AI agents.', '');
push(
	'brainjar manages AI agent behavior through composable layers. Instead of one monolithic config file, you separate what the agent sounds like (soul), how it works (persona), what constraints it follows (rules), the playbook it runs (procedure), and the on-demand capabilities the platform loads (skill). Each layer is a markdown document held in a local SQLite store. The CLI is a single Go binary; the same binary serves an optional HTTP/MCP server.',
	'',
);

push('## Quick start', '');
push('```bash');
push('curl -fsSL https://get.brainjar.sh/brainjar/install.sh | sh');
push('brainjar init');
push('brainjar status');
push('```', '');

push('## Docs', '');
push(
	`Every page is available as raw markdown by appending \`.md\` to the URL path. For example: \`${SITE}/getting-started.md\`.`,
	'',
);

for (const entry of sidebar) {
	push(`### ${entry.label}`, '');
	if (entry.slug) {
		push(bullet(entry.slug, entry.label));
	} else if (entry.items) {
		for (const it of entry.items) push(bullet(it.slug, it.label));
	}
	push('');
}

push('', '## Links', '');
push(`- Docs: ${SITE}`);
push('- GitHub: https://github.com/brainjar-sh/brainjar');
push('');

writeFileSync(OUT, out.join('\n'));
console.log(`Generated ${OUT}`);
