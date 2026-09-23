<script>
  // The Symbiotic Liberation Blueprint — canonical, styled rendering.
  //
  // The source is the same markdown that lives in the house workspace
  // (harrsoft/blueprint.md), copied here verbatim and rendered with a small
  // dependency-free renderer. See src/lib/blueprint-markdown.js for why the
  // essay pipeline (mdsvex) is not used for this document.
  import { renderMarkdown } from '$lib/blueprint-markdown.js';
  import blueprintSource from '$lib/blueprint.md?raw';

  const html = renderMarkdown(blueprintSource);
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
