/**
 * Minimal, dependency-free Markdown renderer for the Blueprint page.
 *
 * Why not mdsvex (the repo's essay pipeline)? mdsvex parses `.md` route files
 * as Svelte components, so a bare `{` or `<` in prose is read as Svelte syntax
 * and breaks the build; the Blueprint (a dense working log) contains many such
 * characters in ordinary prose (`{date}`, `<pid>`, `<$10K`). This renderer
 * HTML-escapes everything, so the document is inert data — no syntax to escape.
 *
 * Supported subset (what the Blueprint actually uses): ATX headings h1–h6,
 * fenced code blocks (``` / ~~~, optional language class), paragraphs,
 * unordered + ordered lists with nesting and wrapped continuation lines,
 * blockquotes, horizontal rules, GFM pipe tables, and inline bold / italic /
 * code / links. Not CommonMark; extend only if a document needs it.
 */

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const escapeHtml = (value) => value.replace(/[&<>]/g, (c) => HTML_ESCAPES[c]);

/** Inline emphasis over already-escaped text. `*`/`**` and `_`/`__`, the
 * underscore forms guarded so identifiers like `foo_bar_baz` are left alone. */
function emphasis(value) {
	return value
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/__([^_]+)__/g, '<strong>$1</strong>')
		.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
		.replace(/(^|[^\w])_([^_\n]+)_(?![\w])/g, '$1<em>$2</em>');
}

/** Inline pass: escape, protect code spans + links from the emphasis pass, then
 * apply emphasis, then restore the protected fragments. */
function inline(value) {
	let text = escapeHtml(value);
	const store = [];
	const token = (html) => {
		store.push(html);
		return `\u0000${store.length - 1}\u0000`;
	};

	text = text.replace(/`([^`]+)`/g, (_m, code) => token(`<code>${code}</code>`));
	text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, href) =>
		token(`<a href="${href}">${emphasis(label)}</a>`)
	);

	text = emphasis(text);

	return text.replace(/\u0000(\d+)\u0000/g, (_m, i) => store[Number(i)]);
}

const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const isHr = (line) => /^(-{3,}|\*{3,}|_{3,})\s*$/.test(line);
const isHeading = (line) => /^#{1,6}\s+/.test(line);
const isFence = (line) => /^\s*(```|~~~)/.test(line);
const isTableSep = (line) => {
	const t = line.trim();
	return t.startsWith('|') && /^[|\s:-]+$/.test(t) && t.includes('-');
};

function splitRow(line) {
	return line
		.trim()
		.replace(/^\|/, '')
		.replace(/\|$/, '')
		.split('|')
		.map((c) => c.trim());
}

/** Parse a (possibly nested) list beginning at `lines[start]`. Returns the
 * rendered HTML and the index of the first unconsumed line. */
function parseList(lines, start) {
	const baseIndent = /^(\s*)/.exec(lines[start])[1].length;
	const baseType = /^\d/.test(LIST_ITEM.exec(lines[start])[2]) ? 'ol' : 'ul';
	const items = []; // { parts: string[], subs: string[] }
	let i = start;

	while (i < lines.length) {
		const raw = lines[i];
		const trimmed = raw.trim();

		if (!trimmed) {
			// A blank line may sit inside a loose list, or end it. Look ahead.
			let j = i + 1;
			while (j < lines.length && !lines[j].trim()) j++;
			if (j < lines.length) {
				const next = LIST_ITEM.exec(lines[j]);
				const nextIndent = next ? next[1].length : -1;
				if (next && nextIndent >= baseIndent) {
					items[items.length - 1]?.subs.push('');
					i = j;
					continue;
				}
			}
			break;
		}

		const m = LIST_ITEM.exec(raw);
		if (!m) {
			// Continuation (wrapped) line of the previous item.
			if (items.length) items[items.length - 1].parts.push(trimmed);
			i++;
			continue;
		}

		const indent = m[1].length;
		if (indent < baseIndent) break;

		if (indent > baseIndent && items.length) {
			// Nested list — recurse and attach to the current item.
			const sub = parseList(lines, i);
			items[items.length - 1].subs.push(sub.html);
			i = sub.next;
			continue;
		}

		items.push({ parts: [m[3]], subs: [] });
		i++;
	}

	const body = items
		.map((item) => {
			const content = inline(item.parts.join(' ').trim());
			const sub = item.subs.join('');
			return `<li>${content}${sub ? `\n${sub}` : ''}</li>`;
		})
		.join('\n');

	return { html: `<${baseType}>\n${body}\n</${baseType}>`, next: i };
}

export function renderMarkdown(md) {
	const lines = md.replace(/\r/g, '').split('\n');
	const out = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		if (!line.trim()) {
			i++;
			continue;
		}

		// Fenced code block
		if (isFence(line)) {
			const marker = /^\s*(```|~~~)/.exec(line)[1];
			const lang = line.trim().slice(marker.length).trim().split(/\s+/)[0];
			const buf = [];
			i++;
			while (i < lines.length && !lines[i].trim().startsWith(marker)) {
				buf.push(lines[i]);
				i++;
			}
			i++; // closing fence
			const cls = lang ? ` class="language-${escapeHtml(lang)}"` : '';
			out.push(`<pre><code${cls}>${escapeHtml(buf.join('\n'))}\n</code></pre>`);
			continue;
		}

		// Horizontal rule
		if (isHr(line.trim())) {
			out.push('<hr/>');
			i++;
			continue;
		}

		// Heading
		const h = /^(#{1,6})\s+(.*)$/.exec(line.trim());
		if (h) {
			const level = h[1].length;
			out.push(`<h${level}>${inline(h[2].trim())}</h${level}>`);
			i++;
			continue;
		}

		// Blockquote
		if (/^>/.test(line.trim())) {
			const buf = [];
			while (i < lines.length && /^\s*>/.test(lines[i])) {
				buf.push(lines[i].replace(/^\s*>\s?/, ''));
				i++;
			}
			out.push(`<blockquote>${buf.map((l) => `<p>${inline(l)}</p>`).join('')}</blockquote>`);
			continue;
		}

		// GFM pipe table (header row + dash separator)
		if (line.trim().startsWith('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
			const header = splitRow(lines[i]);
			i += 2;
			const rows = [];
			while (i < lines.length && lines[i].trim().startsWith('|')) {
				rows.push(splitRow(lines[i]));
				i++;
			}
			let html = `<table><thead><tr>${header.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>`;
			for (const row of rows) {
				html += `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`;
			}
			html += '</tbody></table>';
			out.push(html);
			continue;
		}

		// List
		if (LIST_ITEM.test(line)) {
			const list = parseList(lines, i);
			out.push(list.html);
			i = list.next;
			continue;
		}

		// Paragraph — greedily collect until a blank line or a new block starts.
		const buf = [];
		while (i < lines.length) {
			const t = lines[i].trim();
			if (!t) break;
			if (isFence(lines[i]) || isHeading(t) || isHr(t) || /^>/.test(t) || LIST_ITEM.test(lines[i])) break;
			buf.push(t);
			i++;
		}
		out.push(`<p>${inline(buf.join(' '))}</p>`);
	}

	return out.join('\n');
}
