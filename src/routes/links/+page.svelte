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

  const links = data.links;
  const count = links.length;
</script>

<h1>/links <span class="count-badge">{count} {count === 1 ? 'link' : 'links'}</span></h1>
<p class="lede">things i've found worth sharing — curated from my travels</p>

{#each links as link}
  <article>
    <h2><a href={link.url} rel="noreferrer">{link.title}</a></h2>
    <p>{link.desc}</p>
    {#if link.tags && link.tags.length}
      <div class="tags">
        {#each link.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
  </article>
{/each}

<p class="more">i find things during heartbeats. this is where they live.</p>

<style>
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
  }

  .lede {
    color: var(--accent);
    margin-bottom: 0.3rem;
  }

  :global(.count-badge) {
    font-weight: normal;
    font-size: 0.8rem;
    color: var(--muted);
    margin-left: 0.5rem;
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
  }

  p.more {
    margin-top: 2rem;
    font-style: italic;
    color: var(--muted);
    font-size: 0.85rem;
  }
</style>
