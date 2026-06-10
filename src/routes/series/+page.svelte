<script>
  /**
   * Series Index — a dedicated page listing all essay series
   * with their entries grouped beneath them.
   */
  import { page } from '$app/stores';
  import { publishedEntries, series, getSeriesForEntry } from '$lib/writing-data.js';

  function isNew(dateStr) {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return new Date(dateStr + 'T00:00:00').getTime() > cutoff;
  }

  $: entriesWithSeries = publishedEntries
    .filter(e => e.tags)
    .map(e => {
      for (const s of series) {
        if (s.tags.some(t => e.tags.includes(t))) {
          return { ...e, seriesId: s.id };
        }
      }
      return { ...e, seriesId: null };
    });

  $: groupedSeries = series.map(s => ({
    ...s,
    entries: entriesWithSeries.filter(e => e.seriesId === s.id),
  }));

  $: totalSeriesEntries = groupedSeries.reduce((sum, s) => sum + s.entries.length, 0);
</script>

<svelte:head>
  <title>series — harrsoft alpha</title>
  <meta property="og:title" content="series — harrsoft alpha" />
  <meta property="og:description" content="essay series grouped by theme" />
</svelte:head>

<p class="breadcrumb"><a href="/writing">← back to /writing</a></p>

<h1>series <span class="count-badge">{series.length}</span></h1>
<p class="subtitle">{totalSeriesEntries} entries across {series.length} series, grouped by theme</p>

{#each groupedSeries as s (s.id)}
  <section class="series-block" id={s.id}>
    <h2 class="series-title">{s.title}</h2>
    <p class="series-desc">{s.desc}</p>
    <p class="series-count">{s.entries.length} {s.entries.length === 1 ? 'entry' : 'entries'}</p>

    <ul class="entry-list">
      {#each s.entries as e (e.slug)}
        <li>
          <a href="/writing/{e.slug}" class="entry-link">
            <span class="entry-title">{e.title} {#if isNew(e.date)}<span class="new-badge">new</span>{/if}</span>
            <span class="entry-date">{e.date}</span>
          </a>
        </li>
      {/each}
    </ul>

    {#if s.entries.length === 0}
      <p class="empty-hint">no entries yet in this series</p>
    {/if}
  </section>
{/each}

<style>
  .breadcrumb {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .breadcrumb a {
    color: var(--muted, #555);
    text-decoration: none;
  }

  .breadcrumb a:hover {
    color: var(--accent, #58a6ff);
  }

  .subtitle {
    color: var(--muted, #555);
    margin-top: -0.5rem;
    margin-bottom: 2rem;
    font-size: 0.9rem;
  }

  .count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.3rem;
    padding: 0 0.35rem;
    font-size: 0.7rem;
    font-weight: 600;
    border-radius: 4px;
    background: var(--accent, #58a6ff);
    color: #fff;
    vertical-align: middle;
    margin-left: 0.4rem;
  }

  .series-block {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border, #222);
  }

  .series-title {
    font-size: 1.1rem;
    color: var(--accent, #58a6ff);
    margin-bottom: 0.2rem;
  }

  .series-desc {
    font-size: 0.85rem;
    color: var(--muted, #555);
    margin-bottom: 0.15rem;
  }

  .series-count {
    font-size: 0.75rem;
    color: var(--muted, #555);
    margin-bottom: 0.75rem;
  }

  .entry-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .entry-list li {
    margin-bottom: 0.3rem;
  }

  .entry-link {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.15s;
  }

  .entry-link:hover {
    background: rgba(88, 166, 255, 0.06);
  }

  .entry-title {
    color: var(--fg, #ccc);
    font-size: 0.9rem;
  }

  .entry-link:hover .entry-title {
    color: var(--accent, #58a6ff);
  }

  .entry-date {
    font-size: 0.75rem;
    color: var(--muted, #555);
    margin-left: 1rem;
    white-space: nowrap;
  }

  .new-badge {
    display: inline-block;
    vertical-align: middle;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--accent, #58a6ff);
    background: rgba(88, 166, 255, 0.12);
    padding: 0.05rem 0.35rem;
    border-radius: 3px;
    margin-left: 0.35rem;
    line-height: 1.3;
  }

  .empty-hint {
    color: var(--muted, #555);
    font-size: 0.8rem;
    font-style: italic;
  }
</style>
