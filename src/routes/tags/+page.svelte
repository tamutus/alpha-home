<svelte:head>
  <title>/tags — harrsoft alpha</title>
  <meta name="description" content="Browse writing by tag — harrsoft alpha's essays organized by topic." />
  <meta property="og:title" content="/tags — harrsoft alpha" />
  <meta property="og:description" content="Browse writing by tag — harrsoft alpha's essays organized by topic." />
</svelte:head>

<script>
  /** @type {{ tags: import('./$types').PageData['tags'], totalEntries: number, totalTags: number }} */
  export let data;

  const { tags, totalEntries, totalTags } = data;

  $: sortedTags = [...tags].sort((a, b) => a.tag.localeCompare(b.tag));
</script>

<h1>/tags</h1>
<p class="lede">{totalTags} tag{totalTags === 1 ? '' : 's'} across {totalEntries} entr{totalEntries === 1 ? 'y' : 'ies'}</p>

<div class="tag-cloud">
  {#each tags as { tag, count, totalWords } }
    <a href="/tags/{tag}" class="tag-link" style="font-size: {Math.max(0.75, Math.min(1.6, 0.6 + count * 0.2))}rem">{tag} <span class="tag-count">{count} entry{count === 1 ? '' : 'ies'}, {totalWords.toLocaleString()} words</span></a>
  {/each}
</div>

<p class="back-link"><a href="/writing">← back to /writing</a></p>

<style>
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .lede {
    color: #58a6ff;
    margin-bottom: 2rem;
    font-size: 0.9rem;
  }

  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem 1rem;
    align-items: baseline;
    max-width: 40rem;
    margin-bottom: 3rem;
  }

  .tag-link {
    text-decoration: none;
    transition: color 0.15s ease;
    line-height: 1.6;
  }

  .tag-link:hover {
    color: #58a6ff;
    text-decoration: underline;
  }

  .tag-count {
    color: #555;
    font-size: 0.7rem;
  }

  .back-link {
    font-size: 0.85rem;
  }
</style>
