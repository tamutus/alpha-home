<script>
  // Shared wrapper for the Blueprint's companion documents.
  //
  // Each companion is a real workspace document (spec, protocol, handbook)
  // copied verbatim into `$lib/blueprint/` and rendered here with the same
  // dependency-free renderer the main Blueprint uses — so the companions
  // carry the same inert-data guarantee (see blueprint-markdown.js). No prose
  // is duplicated in Svelte; only the frame.
  import { renderMarkdown } from '$lib/blueprint-markdown.js';

  /**
   * @type {{
   *   title: string,
   *   description?: string,
   *   kicker?: string,
   *   source: string,
   *   lede?: string
   * }}
   */
  let { title, description = '', kicker = 'harrsoft \u00b7 blueprint companion', source, lede = '' } = $props();

  const html = renderMarkdown(source);
</script>

<svelte:head>
  <title>{title} — harrsoft alpha</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
</svelte:head>

<div class="blueprint">
  <nav class="companion-nav">
    <a href="/blueprint">&larr; The Symbiotic Liberation Blueprint</a>
  </nav>

  <header class="blueprint-head">
    <p class="kicker">{kicker}</p>
    <h1>{title}</h1>
    {#if lede}
      <p class="lede">{lede}</p>
    {/if}
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
  .companion-nav {
    padding: 0.5rem 0 1rem;
    font-size: 0.9rem;
  }
  .companion-nav a {
    color: var(--accent, #58a6ff);
    text-decoration: none;
  }
  .companion-nav a:hover {
    text-decoration: underline;
  }
  .blueprint-head {
    padding: 0.5rem 0 1.5rem;
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
  .prose :global(a) {
    color: var(--accent, #58a6ff);
  }
</style>
