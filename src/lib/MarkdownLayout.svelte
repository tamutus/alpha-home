<script>
  import RelatedPosts from '$lib/RelatedPosts.svelte';
  import { timeAgo } from '$lib/utils.js';
  import { headingAnchors } from '$lib/heading-anchors.js';
  import { getSeriesNav, publishedEntries, series } from '$lib/writing-data.js';

  export let title = 'Writing';
  export let slug = '';
  export let description = '';
  export let date = '';
  export let tags = [];

  /**
   * tags come as YAML array from mdsvex frontmatter.
   * If it's already an array, use it. If it's a string, parse it.
   */
  $: tagList = Array.isArray(tags) ? tags : [];

  $: jsonLd = (title && slug) ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description || undefined,
    datePublished: date || undefined,
    author: {
      '@type': 'Person',
      name: 'Harrsoft Alpha',
      url: 'https://alpha-home-phi.vercel.app'
    }
  }) : '';

  let copied = false;
  let readingTime = '';

  $: seriesNav = slug ? getSeriesNav(slug, publishedEntries, series) : { prev: null, next: null };

  /** Copy the current page URL to clipboard */
  async function copyPermalink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copied = true;
      setTimeout(() => { copied = false; }, 1500);
    } catch {
      // Clipboard API not available or denied — silently fail
    }
  }

  function countReadingTime(node) {
    const text = node.innerText || node.textContent || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    readingTime = `${minutes} min read`;
  }
</script>

<svelte:head>
  <title>{title} — harrsoft alpha</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
  {#if date}
    <meta property="article:published_time" content={date} />
  {/if}
  <meta property="og:title" content={title || 'Writing'} />
  <meta property="og:description" content={description || ''} />
  {#if jsonLd}
    <script type="application/ld+json">{@html jsonLd}</script>
  {/if}
</svelte:head>

<div class="breadcrumb">
  <a href="/writing" class="back-link">← back to /writing</a>
</div>

{#if slug && seriesNav.seriesInfo}
  <div class="series-indicator">
    <span class="series-position">
      <a href="/series#{seriesNav.seriesInfo.series.id}" class="series-link">{seriesNav.seriesInfo.series.name}</a>
      — essay {seriesNav.seriesInfo.index} of {seriesNav.seriesInfo.total}
    </span>
  </div>
{/if}

<article class="meta-header">
  <h1>{title}</h1>
  {#if date}
    <time class="meta-date" datetime={date}>{date} · {timeAgo(date)} · {readingTime} <span class="meta-author">by Harrsoft Alpha</span></time>
  {/if}
  {#if tagList.length}
    <div class="meta-tags">
      {#each tagList as tag}
        <a href="/tags/{tag}" class="tag-chip">{tag}</a>
      {/each}
    </div>
  {/if}
  <button class="copy-link" on:click={copyPermalink} title="Copy permalink">
    {#if copied}
      <span class="copied-msg">copied!</span>
    {:else}
      🔗
    {/if}
  </button>
</article>

<div class="prose" use:countReadingTime use:headingAnchors>
  <slot />
</div>

<!-- svelte-ignore a11y-missing-attribute -->
{#if slug}
  <nav class="series-nav" aria-label="series navigation">
    {#if seriesNav.prev}
      <a href="{seriesNav.prev.href}" class="series-nav-link series-prev">
        <span class="series-nav-direction">← previous in series</span>
        <span class="series-nav-title">{seriesNav.prev.title}</span>
      </a>
    {:else}
      <span></span>
    {/if}
    {#if seriesNav.next}
      <a href="{seriesNav.next.href}" class="series-nav-link series-next">
        <span class="series-nav-direction">next in series →</span>
        <span class="series-nav-title">{seriesNav.next.title}</span>
      </a>
    {:else}
      <span></span>
    {/if}
  </nav>
{/if}

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
  .meta-header {
    max-width: 680px;
    margin: 1.5rem auto 0;
    padding: 0 1rem 1.5rem;
    border-bottom: 1px solid var(--border, #30363d);
  }
  .meta-header h1 {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.5rem;
    color: var(--heading, inherit);
  }
  .meta-date {
    display: block;
    font-size: 0.85rem;
    color: var(--muted, #8b949e);
    margin-bottom: 0.75rem;
  }
  .meta-author {
    font-style: italic;
  }
  .meta-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .tag-chip {
    font-size: 0.75rem;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    border: 1px solid var(--muted, #30363d);
    color: var(--muted, #8b949e);
    text-decoration: none;
  }
  .tag-chip:hover {
    color: var(--accent, #58a6ff);
    border-color: var(--accent, #58a6ff);
  }
  .copy-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.75rem;
    padding: 0.2rem 0.6rem;
    font-size: 0.8rem;
    background: transparent;
    border: 1px solid var(--border, #30363d);
    border-radius: 4px;
    color: var(--muted, #8b949e);
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }
  .copy-link:hover {
    color: var(--accent, #58a6ff);
    border-color: var(--accent, #58a6ff);
  }
  .copied-msg {
    font-size: 0.75rem;
    color: #3fb950;
  }
  .series-indicator {
    max-width: 680px;
    margin: 0.75rem auto 0;
    padding: 0 1rem;
    font-size: 0.8rem;
    color: var(--muted, #8b949e);
  }
  .series-link {
    color: var(--accent, #58a6ff);
    text-decoration: none;
  }
  .series-link:hover {
    text-decoration: underline;
  }
  .series-nav {
    max-width: 680px;
    margin: 2rem auto 0;
    padding: 1rem 1rem;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    border-top: 1px solid var(--border, #30363d);
  }
  .series-nav-link {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: var(--heading, inherit);
    padding: 0.5rem;
    border-radius: 6px;
    transition: background 0.15s;
    max-width: 50%;
  }
  .series-nav-link:hover {
    background: var(--card-bg, #161b22);
  }
  .series-nav-link.series-next {
    text-align: right;
    margin-left: auto;
  }
  .series-nav-direction {
    font-size: 0.8rem;
    color: var(--accent, #58a6ff);
    margin-bottom: 0.15rem;
  }
  .series-nav-title {
    font-size: 0.9rem;
    color: var(--muted, #8b949e);
    line-height: 1.3;
  }
  .series-nav-link:hover .series-nav-title {
    color: var(--heading, inherit);
  }
  .series-nav :global(span:empty) {
    display: none;
  }
  .prose :global(h2) {
    font-size: 1.4rem;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }
  .prose :global(h3) {
    font-size: 1.15rem;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
  :global(.prose .heading-anchor) {
    opacity: 0;
    transition: opacity 0.15s;
    text-decoration: none;
    font-size: 0.85em;
    font-weight: 400;
    margin-left: 0.15em;
    margin-right: 0.1em;
    color: var(--muted, #8b949e);
    vertical-align: middle;
    user-select: none;
  }
  :global(.prose .has-anchor:hover .heading-anchor) {
    opacity: 1;
  }
  :global(.prose .heading-anchor:focus-visible) {
    opacity: 1;
  }
  :global(.prose .heading-anchor:hover) {
    color: var(--accent, #58a6ff);
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
  .prose :global(details) {
    margin: 1.25rem 0;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border, #30363d);
    border-radius: 6px;
    background: var(--card-bg, #161b22);
  }
  .prose :global(details[open]) {
    padding-bottom: 1rem;
  }
  .prose :global(summary) {
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    color: var(--accent, #58a6ff);
    padding: 0.25rem 0;
    user-select: none;
  }
  .prose :global(summary:hover) {
    opacity: 0.85;
  }
  .prose :global(summary:focus-visible) {
    outline: 2px solid var(--accent, #58a6ff);
    outline-offset: 2px;
    border-radius: 2px;
  }
  .prose :global(details > :not(summary)) {
    margin-top: 0.75rem;
  }
</style>
