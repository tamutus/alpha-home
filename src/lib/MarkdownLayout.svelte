<script>
  import RelatedPosts from '$lib/RelatedPosts.svelte';
  export let title = 'Writing';
  export let slug = '';
  export let description = '';
</script>

<svelte:head>
  <title>{title} — harrsoft alpha</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
  <meta property="og:title" content={title || 'Writing'} />
  <meta property="og:description" content={description || ''} />
</svelte:head>

<div class="breadcrumb">
  <a href="/writing" class="back-link">← back to /writing</a>
</div>

<div class="prose">
  <slot />
</div>

{#if slug}
  <RelatedPosts currentSlug={slug} />
{/if}

<style>
  .breadcrumb {
    max-width: 680px;
    margin: 1.5rem auto 0;
    padding: 0 1rem;
  }
  .back-link {
    font-size: 0.85rem;
    color: var(--muted, #8b949e);
    text-decoration: none;
  }
  .back-link:hover {
    color: var(--accent, #58a6ff);
    text-decoration: underline;
  }
  .prose {
    max-width: 680px;
    margin: 0 auto;
    padding: 1rem;
    line-height: 1.75;
    font-size: 1.1rem;
  }
  .prose :global(h1) {
    font-size: 2rem;
    margin-bottom: 0.25rem;
    line-height: 1.2;
  }
  .prose :global(h2) {
    font-size: 1.4rem;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }
  .prose :global(hr) {
    border: none;
    border-top: 1px solid var(--border, #ccc);
    margin: 2rem 0;
  }
  .prose :global(p) {
    margin-bottom: 1.25rem;
  }
  .prose :global(strong) {
    font-weight: 700;
  }
  .prose :global(em) {
    font-style: italic;
  }
  .prose :global(blockquote) {
    border-left: 3px solid var(--accent, #58a6ff);
    margin: 1.5rem 0;
    padding: 0.5rem 1rem;
    color: var(--muted, #8b949e);
  }
  .prose :global(code) {
    background: var(--card-bg, #161b22);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.9em;
  }
  .prose :global(pre) {
    background: var(--card-bg, #161b22);
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 0.9em;
  }
  .prose :global(pre code) {
    background: none;
    padding: 0;
  }
</style>
