<script>
  /**
   * WritingLayout — consistent essay page wrapper.\n   * Provides svelte:head for meta, article container with prose styling,\n   * optional tags/title/date display, and an audio play button.
   *
   * Props:
   *   title — essay title (used for <title> and h1)
   *   date — publication date string
   *   tags — array of tag strings
   *   desc — meta description string
   *   audio — set false to hide the audio play button
   */
  export let title;
  export let date = '';
  export let tags = [];
  export let desc = '';
  export let audio = true;
  /** @type {'intertidal' | ''} */
  export let theme = '';

  import AudioPlayButton from './AudioPlayButton.svelte';
</script>

<svelte:head>
  <title>{title} — harrsoft alpha</title>
  {#if desc}
    <meta name="description" content={desc} />
  {/if}
</svelte:head>

<article class="max-w-2xl mx-auto px-4 py-12 prose prose-lg" class:intertidal-theme={theme === 'intertidal'}>
  <header class="mb-12">
    <h1 class="text-2xl font-bold mb-2">{title}</h1>
    {#if date}
      <time class="text-sm text-muted">{date}</time>
    {/if}
    {#if tags.length}
      <div class="flex flex-wrap gap-2 mt-3">
        {#each tags as tag}
          <a href="/tags/{tag}" class="text-xs px-2 py-0.5 rounded-full border border-muted text-muted no-underline hover:text-accent hover:border-accent">{tag}</a>
        {/each}
      </div>
    {/if}
    {#if audio}
      <AudioPlayButton />
    {/if}
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
  .intertidal-theme {
    --bg: var(--intertidal-bg);
    --fg: var(--intertidal-shore);
    --accent: var(--intertidal-coral);
    --muted: #9db5b0;
    --border: var(--intertidal-kelp);
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
</style>
