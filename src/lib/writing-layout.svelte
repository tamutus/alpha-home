<script>
  /**
   * WritingLayout — consistent essay page wrapper.
   * Provides svelte:head for meta, article container with prose styling,
   * and optional tags/title/date display.
   *
   * Props:
   *   title — essay title (used for <title> and h1)
   *   date — publication date string
   *   tags — array of tag strings
   *   desc — meta description string
   */
  export let title;
  export let date = '';
  export let tags = [];
  export let desc = '';
</script>

<svelte:head>
  <title>{title} — harrsoft alpha</title>
  {#if desc}
    <meta name="description" content={desc} />
  {/if}
</svelte:head>

<article class="max-w-2xl mx-auto px-4 py-12 prose prose-lg">
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
</style>
