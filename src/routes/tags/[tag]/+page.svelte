<svelte:head>
  <title>"{data.tag}" — tags — harrsoft alpha</title>
  <meta name="description" content="{data.entries.length} entries tagged {data.tag} — harrsoft alpha's writing" />
  <meta property="og:title" content="tag: {data.tag} — harrsoft alpha" />
  <meta property="og:description" content="{data.entries.length} entries tagged {data.tag} — harrsoft alpha's writing" />
</svelte:head>

<script>
  /** @type {{ tag: string, entries: import('./$types').PageData['entries'] }} */
  export let data;

  const { tag, entries } = data;

  function readingTime(words) {
    if (!words) return '';
    const min = Math.max(1, Math.round(words / 200));
    return `${min} min read`;
  }
</script>

<h1># {tag} <span class="count-badge">{data.totalCount} entries · tagged {tag} — {entries.length}</span></h1>

{#each entries as entry}
  <article>
    <div class="meta">
      <span class="date">{entry.date}</span>
      {#if readingTime(entry.words)}
        <span class="reading-time">· {readingTime(entry.words)}</span>
      {/if}
    </div>
    <h2><a href={entry.href}>{entry.title}</a></h2>
    <p>{entry.desc}</p>
    {#if entry.tags && entry.tags.length}
      <div class="entry-tags">
        {#each entry.tags as t}
          <a href="/tags/{t}" class="tag-chip" class:active={t === tag}>{t}</a>
        {/each}
      </div>
    {/if}
  </article>
{/each}

<p class="back-link"><a href="/tags">← all tags</a> · <a href="/writing">/writing</a></p>

<style>
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .count-badge {
    font-size: 0.65rem;
    font-weight: normal;
    color: #555;
    margin-left: 0.5rem;
    vertical-align: middle;
  }

  article {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #1a1a1a;
  }

  .meta {
    font-size: 0.8rem;
    color: #555;
    margin-bottom: 0.25rem;
  }

  .reading-time {
    color: #666;
    font-size: 0.75rem;
  }

  h2 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 0.5rem;
  }

  .back-link {
    font-size: 0.85rem;
    margin-top: 2rem;
  }

  .entry-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-top: 0.4rem;
  }

  .tag-chip {
    font-size: 0.7rem;
    padding: 0.1rem 0.5rem;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    background: transparent;
    color: #666;
    text-decoration: none;
    transition: all 0.15s ease;
  }

  .tag-chip:hover {
    border-color: #58a6ff;
    color: #58a6ff;
  }

  .tag-chip.active {
    border-color: #58a6ff;
    color: #58a6ff;
    background: rgba(88, 166, 255, 0.1);
  }
</style>
