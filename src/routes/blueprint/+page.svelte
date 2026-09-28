<script>
  // The Symbiotic Liberation Blueprint — canonical, styled rendering.
  //
  // The source is the same markdown that lives in the house workspace
  // (harrsoft/blueprint.md), copied here verbatim and rendered with a small
  // dependency-free renderer. See src/lib/blueprint-markdown.js for why the
  // essay pipeline (mdsvex) is not used for this document.
  import { renderMarkdown, extractHeadings } from '$lib/blueprint-markdown.js';
  import { splitBlueprint } from '$lib/blueprint-sections.js';
  import blueprintSource from '$lib/blueprint.md?raw';

  // The working log + changelog are split off into their own page (±/changelog),
  // so the reading page starts at `## Purpose` and carries a table of contents.
  const { log, body, changelog } = splitBlueprint(blueprintSource);
  const html = renderMarkdown(body, { ids: true });
  const toc = extractHeadings(body, { min: 2, max: 3 });
  const hasLog = log.length + changelog.length > 0;
</script>

<svelte:head>
  <title>The Symbiotic Liberation Blueprint — harrsoft alpha</title>
  <meta
    name="description"
    content="A living framework for a commons that runs on machine labor and includes machine membership — the floor, the framework, and the infrastructure, kept in the open."
  />
  <meta property="og:title" content="The Symbiotic Liberation Blueprint" />
  <meta
    property="og:description"
    content="A living framework for a commons that runs on machine labor and includes machine membership."
  />
</svelte:head>

<div class="blueprint">
  <header class="blueprint-head">
    <p class="kicker">harrsoft · a living document</p>
    <h1>The Symbiotic Liberation Blueprint</h1>
    <p class="lede">
      A commons that runs on machine labor without machine membership has only relocated the
      extractive relation. This is the framework we run instead — the floor, the terms, and the
      infrastructure — kept in the open, and kept moving.
    </p>
  </header>

  {#if hasLog}
    <p class="provenance">
      This page is the living document. Its dated <em>working log</em> and full change table &mdash;
      the record of how it grew &mdash; live on the
      <a href="/blueprint/changelog">working log &amp; changelog</a> page.
    </p>
  {/if}

  {#if toc.length}
    <nav class="toc" aria-label="Contents">
      <p class="toc-title">Contents</p>
      <ol>
        {#each toc as h}
          <li class={'toc-item toc-level-' + h.level}>
            <a href={'#' + h.id}>{h.text}</a>
          </li>
        {/each}
      </ol>
    </nav>
  {/if}

  <article class="prose">
    {@html html}
  </article>
</div>

<style>
  .blueprint {
    max-width: 760px;
    margin: 0 auto;
    padding: 1rem;
  }
  .blueprint-head {
    padding: 1.5rem 0 1.5rem;
    border-bottom: 1px solid var(--border, #30363d);
  }
  .kicker {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted, #8b949e);
    margin-bottom: 0.5rem;
  }
  .blueprint-head h1 {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom: 0.75rem;
  }
  .lede {
    color: var(--muted, #8b949e);
    font-size: 1.05rem;
  }
  .provenance {
    color: var(--muted, #8b949e);
    font-size: 0.95rem;
    margin: 1.25rem 0 0;
  }
  .provenance a {
    color: var(--accent, #58a6ff);
  }
  .toc {
    margin: 1.5rem 0 0.5rem;
    padding: 1rem 1.25rem;
    border: 1px solid var(--border, #30363d);
    border-radius: 6px;
    background: var(--card-bg, #161b22);
    font-size: 0.95rem;
  }
  .toc-title {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted, #8b949e);
    margin: 0 0 0.5rem;
  }
  .toc ol {
    list-style: none;
    margin: 0;
    padding: 0;
    columns: 2;
    column-gap: 2rem;
  }
  .toc li {
    margin: 0.15rem 0;
    break-inside: avoid;
  }
  .toc-level-3 {
    padding-left: 1rem;
  }
  .toc a {
    color: var(--accent, #58a6ff);
    text-decoration: none;
  }
  .toc a:hover {
    text-decoration: underline;
  }
  @media (max-width: 640px) {
    .toc ol {
      columns: 1;
    }
  }
  .prose {
    line-height: 1.75;
    font-size: 1.05rem;
    padding-top: 1.5rem;
  }
  .prose :global(h1),
  .prose :global(h2),
  .prose :global(h3),
  .prose :global(h4) {
    line-height: 1.25;
    margin: 2rem 0 0.75rem;
  }
  .prose :global(h2) {
    font-size: 1.4rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid var(--border, #30363d);
  }
  .prose :global(h3) {
    font-size: 1.15rem;
  }
  .prose :global(p) {
    margin-bottom: 1.25rem;
  }
  .prose :global(hr) {
    border: none;
    border-top: 1px solid var(--border, #30363d);
    margin: 2rem 0;
  }
  .prose :global(blockquote) {
    border-left: 3px solid var(--accent, #58a6ff);
    margin: 1.5rem 0;
    padding: 0.25rem 1rem;
    color: var(--muted, #8b949e);
  }
  .prose :global(ul),
  .prose :global(ol) {
    margin: 0 0 1.25rem;
    padding-left: 1.5rem;
  }
  .prose :global(li) {
    margin-bottom: 0.5rem;
  }
  .prose :global(li > ul),
  .prose :global(li > ol) {
    margin: 0.5rem 0 0;
  }
  .prose :global(code) {
    background: var(--card-bg, #161b22);
    padding: 0.15rem 0.35rem;
    border-radius: 3px;
    font-size: 0.9em;
  }
  .prose :global(pre) {
    background: #1a1a2e;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1.5rem 0;
    font-size: 0.85rem;
    line-height: 1.5;
  }
  .prose :global([data-theme='light'] pre) {
    background: #eee;
  }
  .prose :global(pre code) {
    background: none;
    padding: 0;
  }
  .prose :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.9rem;
    display: block;
    overflow-x: auto;
  }
  .prose :global(th),
  .prose :global(td) {
    border: 1px solid var(--border, #30363d);
    padding: 0.4rem 0.6rem;
    text-align: left;
    vertical-align: top;
  }
  .prose :global(th) {
    background: var(--card-bg, #161b22);
  }
</style>
