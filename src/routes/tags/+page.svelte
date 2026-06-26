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

  let sortMode = 'count';

  $: sortedTags = [...tags].sort((a, b) => {
    if (sortMode === 'name') {
      return a.tag.localeCompare(b.tag);
    }
    // default: by count descending, then alpha
    return b.count - a.count || a.tag.localeCompare(b.tag);
  });
</script>

<h1>/tags</h1>
<p class="lede">{totalTags} tag{totalTags === 1 ? '' : 's'} across {totalEntries} entr{totalEntries === 1 ? 'y' : 'ies'}</p>

<div class="sort-bar">
  <button class="sort-btn" class:active={sortMode === 'count'} on:click={() => sortMode = 'count'}>
    by essay count
  </button>
  <button class="sort-btn" class:active={sortMode === 'name'} on:click={() => sortMode = 'name'}>
    by name
  </button>
</div>

<div class="tag-cloud">
  {#each sortedTags as { tag, count, totalWords } }
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
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .sort-bar {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 1.5rem;
  }

  .sort-btn {
    background: none;
    border: 1px solid #333;
    color: #888;
    padding: 0.25rem 0.7rem;
    font-size: 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }

  .sort-btn:hover {
    color: #ccc;
    border-color: #555;
  }

  .sort-btn.active {
    color: #58a6ff;
    border-color: #58a6ff;
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
