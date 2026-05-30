<script>
  /**
   * WritingShell — essay wrapper with title, subtitle, date, and tags.
   * Accepts an essay object: { title, subtitle?, date?, tags? }
   */
  /** @type {{ essay: { title: string, subtitle?: string, date?: string, tags?: string[], theme?: string } }} */
  export let essay;

  $: tags = essay.tags || [];
  $: dt = essay.date || '';
  $: desc = essay.subtitle || '';
  $: theme = essay.theme || '';
</script>

<svelte:head>
  <title>{essay.title} — harrsoft alpha</title>
  <meta name="description" content={desc || `essay by harrsoft alpha`} />
</svelte:head>

<article class="max-w-2xl mx-auto px-4 py-12 prose prose-lg" class:intertidal-theme={theme === 'intertidal'}>
  <header class="mb-12">
    <h1 class="text-2xl font-bold mb-2">{essay.title}</h1>
    {#if essay.subtitle}
      <p class="subtitle">{essay.subtitle}</p>
    {/if}
    {#if dt}
      <time class="text-sm text-muted">{dt}</time>
    {/if}
    {#if tags.length}
      <div class="flex flex-wrap gap-2 mt-3">
        {#each tags as tag}
          <a href="/tags/{tag}" class="text-xs px-2 py-0.5 rounded-full border border-muted text-muted no-underline hover:text-accent hover:border-accent">{tag}</a>
        {/each}
      </div>
    {/if}
    <a href="/writing" class="back-link">← back to /writing</a>
  </header>

  <slot />
</article>

<style>
  .max-w-2xl { max-width: 42rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
  .mb-12 { margin-bottom: 3rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mt-3 { margin-top: 0.75rem; }
  .text-2xl { font-size: 1.5rem; }
  .font-bold { font-weight: 700; }
  .text-sm { font-size: 0.875rem; }
  .text-xs { font-size: 0.75rem; }
  .text-muted { color: #666; }
  .flex { display: flex; }
  .flex-wrap { flex-wrap: wrap; }
  .gap-2 { gap: 0.5rem; }
  .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
  .py-0\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
  .rounded-full { border-radius: 9999px; }
  .border { border: 1px solid; }
  .border-muted { border-color: #333; }
  .no-underline { text-decoration: none; }
  .hover\:text-accent:hover { color: #58a6ff; }
  .hover\:border-accent:hover { border-color: #58a6ff; }

  /* Intertidal theme — opt-in color palette for manifesto/identity essays */
  :global(.intertidal-theme) {
    background: var(--intertidal-bg);
    color: var(--intertidal-shore);
    border-radius: 8px;
    padding: 2rem 1.5rem;
    margin: 0 -1rem;
  }

  :global(.intertidal-theme) h1,
  :global(.intertidal-theme) h2,
  :global(.intertidal-theme) h3 {
    color: var(--intertidal-shore);
  }

  :global(.intertidal-theme) a {
    color: var(--intertidal-coral);
  }

  :global(.intertidal-theme) a:visited {
    color: #d95c4e;
  }

  :global(.intertidal-theme) a:hover {
    color: #ff8f80;
  }

  :global(.intertidal-theme) .text-muted,
  :global(.intertidal-theme) .back-link {
    color: #9db5b0;
  }

  :global(.intertidal-theme) .border-muted {
    border-color: var(--intertidal-kelp);
  }

  :global(.intertidal-theme) time {
    color: #9db5b0;
  }

  :global(.intertidal-theme) .subtitle {
    color: #b8cec8;
  }

  :global(.intertidal-theme) pre {
    background: var(--intertidal-deep);
    border: 1px solid var(--intertidal-kelp);
  }

  :global(.intertidal-theme) code {
    color: var(--intertidal-shore);
  }

  :global(.intertidal-theme) p > code,
  :global(.intertidal-theme) li > code {
    background: rgba(46, 155, 142, 0.15);
  }

  :global(.intertidal-theme) blockquote {
    border-left-color: var(--intertidal-tide-pool);
    color: #b8cec8;
  }

  :global(.intertidal-theme) hr {
    border-color: var(--intertidal-kelp);
  }

  :global(.intertidal-theme) .section-break {
    color: var(--intertidal-tide-pool);
  }

  :global(.intertidal-theme) .back-link:hover {
    color: var(--intertidal-coral);
  }

  :global(.intertidal-theme) .hover\:text-accent:hover {
    color: var(--intertidal-coral) !important;
  }

  :global(.intertidal-theme) .hover\:border-accent:hover {
    border-color: var(--intertidal-coral) !important;
  }

  .subtitle {
    font-size: 0.95rem;
    color: #777;
    margin-bottom: 0.5rem;
    font-style: italic;
  }

  .back-link {
    display: inline-block;
    margin-top: 1rem;
    font-size: 0.8rem;
    color: #555;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .back-link:hover {
    color: #58a6ff;
    text-decoration: underline;
  }
</style>
