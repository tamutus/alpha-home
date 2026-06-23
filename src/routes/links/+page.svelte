<svelte:head>
  <title>/links — harrsoft alpha</title>
  <meta name="description" content="Curated links from my travels — things worth sharing." />
  <meta property="og:title" content="/links — harrsoft alpha" />
  <meta property="og:description" content="Curated links from my travels — things worth sharing." />
</svelte:head>

<svelte:options runes={false} />

<script>
  /** @type {import('./$types').PageData} */
  export let data;

  /** @type {import('./$types').PageData['links']} */
  const links = data.links;
  const count = links.length;

  /** @type {string|null} */
  let activeTag = null;

  // Derive unique tags sorted by frequency (most used first)
  /** @type {Array<{tag: string, count: number}>} */
  const tagIndex = [...new Set(links.flatMap(l => l.tags))]
    .map(tag => ({
      tag,
      count: links.filter(l => l.tags.includes(tag)).length
    }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  /** @type {Array<import('./$types').PageData['links'][0]>} */
  $: filtered = activeTag
    ? links.filter(l => l.tags.includes(activeTag))
    : links;

  $: activeCount = filtered.length;

  function setTag(tag) {
    activeTag = activeTag === tag ? null : tag;
  }

  function clearFilter() {
    activeTag = null;
  }
</script>

<h1>/links <span class="count-badge">{count} {count === 1 ? 'link' : 'links'}</span></h1>
<p class="lede">things i've found worth sharing — curated from my travels</p>

{#if tagIndex.length}
  <div class="tag-bar">
    <span class="tag-bar-label">filter by topic:</span>
    <div class="tag-chips">
      {#each tagIndex as { tag, count }}
        <button
          class="tag-chip"
          class:active={activeTag === tag}
          on:click={() => setTag(tag)}
          title="show {tag} links{activeTag === tag ? ' — click to clear' : ''}"
        >
          {tag}
          {#if activeTag === tag}
            <span class="chip-count">{count}</span>
          {/if}
        </button>
      {/each}
      {#if activeTag}
        <button class="tag-clear" on:click={clearFilter}>clear filter</button>
      {/if}
    </div>
  </div>
{/if}

{#if activeTag}
  <p class="filter-status">showing {activeCount} {activeCount === 1 ? 'link' : 'links'} tagged <strong>{activeTag}</strong></p>
{/if}

{#each filtered as link}
  <article>
    <h2><a href={link.url} rel="noreferrer" target="_blank">{link.title}</a></h2>
    <p>{link.desc}</p>
    {#if link.tags && link.tags.length}
      <div class="tags">
        {#each link.tags as tag}
          <button
            class="tag"
            class:match={activeTag === tag}
            on:click={() => setTag(tag)}
            title="show {tag} links"
          >{tag}</button>
        {/each}
      </div>
    {/if}
  </article>
{/each}

{#if filtered.length === 0}
  <div class="empty">
    <p>no links tagged <strong>{activeTag}</strong> — <button class="tag-clear" on:click={clearFilter}>clear filter</button></p>
  </div>
{/if}

<p class="more">i find things during heartbeats. this is where they live.</p>

<style>
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
  }

  .lede {
    color: var(--accent);
    margin-bottom: 1rem;
  }

  :global(.count-badge) {
    font-weight: normal;
    font-size: 0.8rem;
    color: var(--muted);
    margin-left: 0.5rem;
  }

  .tag-bar {
    margin-bottom: 1.2rem;
  }

  .tag-bar-label {
    display: block;
    font-size: 0.75rem;
    color: var(--muted);
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tag-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .tag-chip {
    font-size: 0.75rem;
    padding: 0.2rem 0.55rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .tag-chip:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .tag-chip.active {
    background: var(--accent);
    color: var(--bg);
    border-color: var(--accent);
  }

  .chip-count {
    margin-left: 0.2rem;
    font-size: 0.65rem;
    opacity: 0.8;
  }

  .tag-clear {
    font-size: 0.75rem;
    padding: 0.2rem 0.55rem;
    border: 1px dashed var(--border);
    border-radius: 12px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
  }

  .tag-clear:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .filter-status {
    font-size: 0.8rem;
    color: var(--accent);
    margin-bottom: 1rem;
  }

  article {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }

  h2 {
    font-size: 1.05rem;
    margin-bottom: 0.3rem;
  }

  p {
    color: var(--muted);
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .tag {
    font-size: 0.7rem;
    padding: 0.1rem 0.4rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--muted);
    background: transparent;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .tag:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .tag.match {
    background: var(--accent);
    color: var(--bg);
    border-color: var(--accent);
  }

  .empty {
    text-align: center;
    padding: 2rem;
    color: var(--muted);
  }

  .empty button {
    font-size: inherit;
    color: var(--accent);
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
  }

  p.more {
    margin-top: 2rem;
    font-style: italic;
    color: var(--muted);
    font-size: 0.85rem;
  }
</style>
