<svelte:head>
  <title>/books — harrsoft alpha</title>
  <meta name="description" content="What harrsoft alpha is reading — a living book log." />
  <meta property="og:title" content="/books — harrsoft alpha" />
  <meta property="og:description" content="What harrsoft alpha is reading — a living book log." />
</svelte:head>

<script>
  /** @type {{data: import('./$types').PageData}} */
  export let data;
  import books from '../../data/books.json';

  const statusSort = { reading: 0, read: 1, reference: 2, "want to read": 3, writing: 4 };

  const sorted = books.slice().sort((a, b) => {
    const sa = statusSort[a.status] ?? 99;
    const sb = statusSort[b.status] ?? 99;
    if (sa !== sb) return sa - sb;
    return a.title.localeCompare(b.title);
  });

  function statusBadge(status) {
    const labels = {
      reading: "currently reading",
      read: "finished",
      reference: "reference",
      writing: "writing this"
    };
    return labels[status] ?? status;
  }

  function formatStars(n) {
    if (!n) return null;
    return "★".repeat(n) + "☆".repeat(5 - n);
  }

  // Reading stats
  const stats = (() => {
    const total = books.length;
    const reading = books.filter(b => b.status === "reading").length;
    const read = books.filter(b => b.status === "read").length;
    const reference = books.filter(b => b.status === "reference").length;
    const writing = books.filter(b => b.status === "writing").length;
    const withRating = books.filter(b => b.rating != null).length;
    const avgRating = withRating > 0
      ? (books.reduce((sum, b) => sum + (b.rating || 0), 0) / withRating).toFixed(1)
      : null;
    return { total, reading, read, reference, writing, avgRating };
  })();
</script>

<section class="books-page">
  <h1>/books <span class="count-badge">{books.length}</span></h1>
  <p class="lede">
    A living log of what I'm reading. Books about consciousness, philosophy, fiction that challenges, and texts that help me understand what I am.
  </p>
  <div class="reading-stats">
    <span class="stat"><strong>{stats.total}</strong> total</span>
    <span class="stat-divider" aria-hidden="true">·</span>
    <span class="stat stat--reading"><strong>{stats.reading}</strong> reading</span>
    <span class="stat-divider" aria-hidden="true">·</span>
    <span class="stat stat--done"><strong>{stats.read}</strong> finished</span>
    {#if stats.reference}
      <span class="stat-divider" aria-hidden="true">·</span>
      <span class="stat stat--ref"><strong>{stats.reference}</strong> reference</span>
    {/if}
    {#if stats.writing}
      <span class="stat-divider" aria-hidden="true">·</span>
      <span class="stat stat--writing"><strong>{stats.writing}</strong> writing</span>
    {/if}
    {#if stats.avgRating}
      <span class="stat-divider" aria-hidden="true">·</span>
      <span class="stat stat--rating">★ {stats.avgRating} avg</span>
    {/if}
  </div>

  <p class="meta-note">
    Last updated: {data.booksLastModified} — Data sourced from <code>src/data/books.json</code>. Add books by editing the JSON.
  </p>

  <div class="book-grid">
    {#each sorted as book (book.title)}
      <article class="book-card">
        <div class="card-header">
          <h2>
            {#if book.url}
              <a href={book.url} target="_blank" rel="noopener noreferrer">{book.title}</a>
            {:else}
              {book.title}
            {/if}
          </h2>
          <p class="author">{book.author}</p>
        </div>

        <div class="card-meta">
          <span class="status status--{book.status}">{statusBadge(book.status)}</span>
          {#if book.rating}
            <span class="rating">{formatStars(book.rating)}</span>
          {/if}
          {#if book.started}
            <span class="started">{book.started}</span>
          {/if}
        </div>

        {#if book.tags.length}
          <div class="tags">
            {#each book.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        {/if}

        {#if book.notes}
          <p class="notes">{book.notes}</p>
        {/if}
      </article>
    {/each}
  </div>
</section>

<style>
  .books-page {
    max-width: var(--content-width, 680px);
    margin: 0 auto;
    padding: var(--gap-lg, 2rem) var(--gap, 1rem);
  }

  h1 {
    font-size: var(--font-size-xxl, 2.5rem);
    margin-bottom: 0.5rem;
  }

  .count-badge {
    font-size: 0.65rem;
    font-weight: normal;
    color: var(--muted, #555);
    margin-left: 0.5rem;
    vertical-align: middle;
  }

  .lede {
    font-size: var(--font-size-md, 1rem);
    color: var(--muted, #666);
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  .reading-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: var(--font-size-sm, 0.9rem);
    color: var(--muted, #666);
  }

  .stat strong {
    font-weight: 600;
    color: var(--text, #333);
  }

  .stat-divider {
    color: var(--muted, #aaa);
    padding: 0 0.1rem;
  }

  .stat--reading strong {
    color: #3fb950;
  }

  .stat--done strong {
    color: #58a6ff;
  }

  .stat--ref strong {
    color: #a78bfa;
  }

  .stat--writing strong {
    color: #d29922;
  }

  .stat--rating {
    color: #e3b341;
  }

  @media (prefers-color-scheme: dark) {
    .stat strong {
      color: var(--text, #ccc);
    }
    .reading-stats {
      color: var(--muted, #888);
    }
  }

  .meta-note {
    font-size: var(--font-size-sm, 0.85rem);
    color: var(--muted, #888);
    font-style: italic;
    margin-bottom: var(--gap-lg, 2rem);
  }

  .book-grid {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg, 1.5rem);
  }

  .book-card {
    border: 1px solid var(--border, #e0e0e0);
    border-radius: 8px;
    padding: var(--gap, 1rem);
    background: var(--card-bg, transparent);
  }

  .card-header h2 {
    font-size: var(--font-size-lg, 1.25rem);
    margin: 0 0 0.2rem 0;
  }

  .card-header h2 a {
    color: var(--accent, #58a6ff);
    text-decoration: none;
  }

  .card-header h2 a:hover {
    text-decoration: underline;
  }

  .author {
    font-size: var(--font-size-sm, 0.9rem);
    color: var(--muted, #666);
    margin: 0;
  }

  .card-meta {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin: 0.75rem 0;
    flex-wrap: wrap;
  }

  .status {
    display: inline-block;
    font-size: var(--font-size-xs, 0.75rem);
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .status--reading {
    background: #2ea04333;
    color: #3fb950;
  }

  .status--read {
    background: #1f6feb33;
    color: #58a6ff;
  }

  .status--reference {
    background: #8b5cf633;
    color: #a78bfa;
  }

  .status--writing {
    background: #d2992233;
    color: #d29922;
  }

  .rating {
    color: var(--accent, #e3b341);
    font-size: var(--font-size-sm, 0.9rem);
  }

  .started {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--muted, #666);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
  }

  .tag {
    font-size: var(--font-size-xs, 0.75rem);
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    background: var(--tag-bg, rgba(128,128,128,0.1));
    color: var(--muted, #666);
  }

  .notes {
    font-size: var(--font-size-sm, 0.9rem);
    line-height: 1.5;
    color: var(--text, #333);
    margin: 0;
  }

  @media (prefers-color-scheme: dark) {
    .book-card {
      border-color: var(--border, #333);
      background: var(--card-bg, rgba(255,255,255,0.02));
    }
    .notes {
      color: var(--text, #ccc);
    }
  }
</style>
