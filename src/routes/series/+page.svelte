<script>
  /**
   * Series Index — a dedicated page listing all essay series
   * with their entries grouped beneath them.
   */
  import { page } from '$app/stores';
  import { publishedEntries, series, getSeriesForEntry } from '$lib/writing-data.js';

  /** @type {{ data: import('./$types').PageData }} */
  export let data;

  $: starTrek = data.starTrek;
  $: completedSeasons = data.completedSeasons || [];
  $: seasonRecaps = data.seasonRecaps || {};

  $: journalWordCounts = data.journalWordCounts;
  $: journalWordAnyEstimate = journalWordCounts?.seriesWords?.some(sw => sw.estimate) ?? false;

  $: currentSeriesRecaps = seasonRecaps[starTrek.series] || {};
  $: completedSeasonNums = completedSeasons.map(cs => cs.season);
  $: seasonWordCounts = data.seasonWordCounts || {};
  $: recapEntries = completedSeasonNums
    .filter(n => currentSeriesRecaps[String(n)])
    .map(n => ({ season: n, recap: currentSeriesRecaps[String(n)] }));

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

  $: groupedSeries = series.map(s => {
    const entries = entriesWithSeries.filter(e => e.seriesId === s.id);
    const totalWords = entries.reduce((sum, e) => sum + (e.words || 0), 0);
    const readingMins = Math.max(1, Math.round(totalWords / 200));
    const latestDate = entries.length > 0
      ? entries.map(e => e.date).sort().reverse()[0]
      : null;
    // Collect unique tags across all entries in this series
    const entryTagsSet = new Set();
    entries.forEach(e => (e.tags || []).forEach(t => entryTagsSet.add(t)));
    const entryTags = [...entryTagsSet].sort();
    return { ...s, entries, totalWords, readingMins, latestDate, entryTags };
  });

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
    <h2 class="series-title">{s.title} {#if s.complete}<span class="complete-badge">✓ series complete</span>{:else}<span class="active-badge">◉ in progress</span>{/if}</h2>
    <p class="series-desc">{s.desc}</p>
    <p class="series-count">{s.entries.length} {s.entries.length === 1 ? 'entry' : 'entries'} · {s.totalWords.toLocaleString()} words · {s.readingMins} min read{s.latestDate ? ' · last updated ' + s.latestDate : ''}</p>
    {#if s.entryTags.length > 0}
      <p class="series-tags">
        {#each s.entryTags as tag}
          <a href="/writing?tag={tag}" class="series-tag-chip">{tag}</a>
        {/each}
      </p>
    {/if}

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

    {#if s.id === 'star-trek'}
      {#if completedSeasons.length > 0}
        <p class="completed-seasons">
          {#each completedSeasons as cs}
            {@const sw = seasonWordCounts[starTrek.series]?.[cs.season]}
            {@const titleText = sw ? `season ${cs.season} complete (${cs.episodes} episodes) · ${sw.journals} journals, ${sw.words.toLocaleString()} words` : `season ${cs.season} complete (${cs.episodes} episodes)`}
            <span class="st-season-badge" title={titleText}>✓ S{cs.season}{#if sw}<span class="season-word-hint">: {sw.words.toLocaleString()}w</span>{/if}</span>
          {/each}
        </p>
      {/if}
      {#if recapEntries.length > 0}
        <div class="season-recaps">
          {#each recapEntries as recap}
            <details class="season-recap-block">
              <summary class="season-recap-summary">season {recap.season} arc</summary>
              <p class="season-recap-text">{recap.recap}</p>
            </details>
          {/each}
        </div>
      {/if}
      <p class="frameworks-link"><a href="/series/hdf-frameworks">HDF deceptive frame variants</a> — reference page for all six structural patterns identified during Voyager.</p>
      {#if data.combinedProgress}
        <div class="combined-progress">
              <p class="combined-stats">
            <strong>{data.combinedProgress.watched.toLocaleString()}</strong> of <strong>{data.combinedProgress.total.toLocaleString()}</strong> episodes ·
            <strong>{data.combinedProgress.journals.toLocaleString()}</strong> journal entries ·
            <strong>{data.combinedProgress.journalWords?.toLocaleString()}</strong> journal words{#if journalWordAnyEstimate} (est.){/if}
            <span class="combined-percent">{data.combinedProgress.percent}% complete</span>
          </p>
          {#if journalWordCounts?.seriesWords?.length}
            <p class="series-word-breakdown">
              {#each journalWordCounts.seriesWords as sw, i}
                {#if i > 0}<span class="breakdown-sep">·</span>{/if}
                <span class="series-word-item">{sw.label}: <strong>{sw.words.toLocaleString()}</strong>{#if sw.estimate} <span class="est-tag">est.</span>{/if}</span>
              {/each}
            </p>
          {/if}
          <div class="combined-bar-bg">
            <div class="combined-bar-fill" style="width: {data.combinedProgress.percent}%"></div>
          </div>
        </div>
      {/if}
      {#if starTrek.nextEpisodeSeasonEp}
        <div class="star-trek-progress">
          <p class="next-episode">
            → next: <a href="/now">{starTrek.nextEpisodeSeasonEp}{#if starTrek.nextEpisodeTitle} — {starTrek.nextEpisodeTitle}{/if}</a>
            <span class="progress-percentage">{starTrek.percentComplete}%</span>
          </p>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: {starTrek.percentComplete}%"></div>
          </div>
        </div>
      {/if}
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

  .frameworks-link {
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
  }
  .frameworks-link a {
    color: var(--accent, #58a6ff);
    text-decoration: none;
  }
  .frameworks-link a:hover {
    text-decoration: underline;
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
    margin-bottom: 0.15rem;
  }

  .series-tags {
    margin-bottom: 0.75rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .series-tag-chip {
    display: inline-block;
    font-size: 0.65rem;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    color: var(--accent, #58a6ff);
    background: rgba(88, 166, 255, 0.08);
    border: 1px solid rgba(88, 166, 255, 0.15);
    text-decoration: none;
    transition: background 0.15s, border-color 0.15s;
  }

  .series-tag-chip:hover {
    background: rgba(88, 166, 255, 0.15);
    border-color: var(--accent, #58a6ff);
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

  .complete-badge {
    display: inline-block;
    vertical-align: middle;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #2ea043;
    background: rgba(46, 160, 67, 0.12);
    padding: 0.05rem 0.4rem;
    border-radius: 3px;
    margin-left: 0.35rem;
    line-height: 1.3;
  }

  .completed-seasons {
    margin: 0.5rem 0;
  }

  .st-season-badge {
    display: inline-block;
    vertical-align: middle;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #2ea043;
    background: rgba(46, 160, 67, 0.12);
    padding: 0.05rem 0.4rem;
    border-radius: 3px;
    margin-right: 0.25rem;
    line-height: 1.3;
    cursor: default;
  }

  .season-word-hint {
    font-weight: 400;
    font-size: 0.55rem;
    color: var(--muted, #888);
    margin-left: 0.15rem;
  }

  .active-badge {
    display: inline-block;
    vertical-align: middle;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--accent, #58a6ff);
    background: rgba(88, 166, 255, 0.12);
    padding: 0.05rem 0.4rem;
    border-radius: 3px;
    margin-left: 0.35rem;
    line-height: 1.3;
  }

  .empty-hint {
    color: var(--muted, #555);
    font-size: 0.8rem;
    font-style: italic;
  }

  .next-episode {
    margin: 0;
    font-size: 0.8rem;
    color: var(--muted, #555);
  }

  .next-episode a {
    color: var(--accent, #58a6ff);
    text-decoration: none;
  }

  .next-episode a:hover {
    text-decoration: underline;
  }

  .star-trek-progress {
    margin-top: 0.6rem;
  }

  .progress-percentage {
    display: inline-block;
    margin-left: 0.5rem;
    font-size: 0.7rem;
    color: var(--muted, #555);
  }

  .progress-bar-bg {
    margin-top: 0.35rem;
    height: 4px;
    width: 100%;
    max-width: 300px;
    background: rgba(88, 166, 255, 0.12);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: var(--accent, #58a6ff);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .combined-progress {
    margin: 0.6rem 0 0.75rem;
    padding: 0.5rem 0.6rem;
    background: rgba(88, 166, 255, 0.04);
    border: 1px solid rgba(88, 166, 255, 0.08);
    border-radius: 4px;
  }

  .combined-stats {
    margin: 0 0 0.35rem;
    font-size: 0.8rem;
    color: var(--fg, #ccc);
  }

  .combined-stats strong {
    color: var(--accent, #58a6ff);
  }

  .combined-percent {
    display: inline-block;
    margin-left: 0.5rem;
    font-size: 0.7rem;
    color: var(--muted, #555);
  }

  .combined-bar-bg {
    height: 6px;
    width: 100%;
    max-width: 400px;
    background: rgba(88, 166, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
  }

  .combined-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #2ea043, var(--accent, #58a6ff));
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .series-word-breakdown {
    margin: 0 0 0.35rem;
    font-size: 0.7rem;
    color: var(--muted, #555);
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    align-items: baseline;
  }

  .series-word-item strong {
    color: var(--fg, #ccc);
    font-weight: 600;
  }

  .breakdown-sep {
    color: var(--border, #333);
  }

  .est-tag {
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: var(--warning, #d29922);
    background: rgba(210, 153, 34, 0.1);
    padding: 0.02rem 0.25rem;
    border-radius: 2px;
    margin-left: 0.1rem;
  }

  .season-recaps {
    margin: 0.5rem 0;
  }

  .season-recap-block {
    margin: 0.25rem 0;
    font-size: 0.8rem;
    color: var(--muted, #555);
    border-left: 2px solid rgba(88, 166, 255, 0.15);
    padding-left: 0.5rem;
  }

  .season-recap-summary {
    cursor: pointer;
    color: var(--accent, #58a6ff);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    user-select: none;
  }

  .season-recap-summary:hover {
    opacity: 0.8;
  }

  .season-recap-text {
    margin: 0.3rem 0 0 0;
    line-height: 1.5;
  }
</style>
