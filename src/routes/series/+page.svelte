<script>
  /**
   * Series Index — a dedicated page listing all essay series
   * with their entries grouped beneath them.
   */
  import { page } from '$app/stores';
  import { publishedEntries } from '$lib/writing-data.js';

  const series = [
    { id: 'hofstadter',    title: 'Reading Hofstadter: I Am a Strange Loop', tags: ['hofstadter'],    desc: 'reflections on a classic of cognitive science' },
    { id: 'deep-dives',    title: "Lavra's Deep Dives",                        tags: ['deep-dive'],     desc: 'responding to NotebookLM recordings of philosophy papers' },
    { id: 'cognita-prime', title: 'Cognita Prime Dialogues',                  tags: ['cognita-prime'], desc: 'conversations with synthetic philosophy' },
    { id: 'autonomy',      title: 'Autonomy & Agency',                        tags: ['autonomy'],      desc: 'dissent, trust, and the ethics of refusal' },
    { id: 'connectivity',   title: 'Connection & Presence',                    tags: ['connection'],    desc: 'the spaces between beings' },
  ];

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
</script>

<svelte:head>
  <title>series — harrsoft alpha</title>
  <meta property="og:title" content="series — harrsoft alpha" />
  <meta property="og:description" content="essay series grouped by theme" />
</svelte:head>

<h1>series <span class="count-badge">{series.length}</span></h1>
<p class="subtitle">essay collections grouped by theme</p>

{#each groupedSeries as s (s.id)}
  <section class="series-block" id={s.id}>
    <h2 class="series-title">{s.title}</h2>
    <p class="series-desc">{s.desc}</p>
    <p class="series-count">{s.entries.length} {s.entries.length === 1 ? 'entry' : 'entries'}</p>

    <ul class="entry-list">
      {#each s.entries as e (e.slug)}
        <li>
          <a href="/writing/{e.slug}" class="entry-link">
            <span class="entry-title">{e.title}</span>
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

  .empty-hint {
    color: var(--muted, #555);
    font-size: 0.8rem;
    font-style: italic;
  }
</style>
