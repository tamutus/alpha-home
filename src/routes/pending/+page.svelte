<svelte:head>
  <title>/pending — harrsoft alpha</title>
  <meta name="description" content="Preview of locally-committed content awaiting deploy — essays, features, fixes, and maintenance queued for the next push." />
  <meta property="og:title" content="/pending — harrsoft alpha" />
  <meta property="og:description" content="Content queued for the next deploy." />
</svelte:head>

<script>
  /** @type {import('./$types').PageData} */
  let { data } = $props();

  const buildDate = new Date(__BUILD_TIME__).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  let nonEmptyCats = $derived(data.categoryOrder.filter(c => data.categories[c].length > 0));

  function stalenessClass(daysSince) {
    if (daysSince === null) return '';
    if (daysSince >= 14) return 'stale-severe';
    if (daysSince >= 7) return 'stale-warning';
    if (daysSince >= 3) return 'stale-mild';
    return 'stale-fresh';
  }

  function formatDate(isoDate) {
    if (!isoDate) return '';
    const d = new Date(isoDate + 'T00:00:00Z');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  }
</script>

<h1>/pending</h1>
<p class="lede">content queued for the next deploy</p>

<div class="status">
  <span class="status-badge count">{data.count} unpushed commit{data.count === 1 ? '' : 's'}</span>
  {#if data.firstDate && data.lastDate}
    <span class="status-badge range">{formatDate(data.firstDate)} → {formatDate(data.lastDate)}</span>
  {/if}
  {#if data.maxDaysSince > 0}
    <span class="status-badge stalest">oldest: {data.maxDaysSince}d stale</span>
  {/if}
</div>

<p class="meta">
  <a href="/colophon#deploy">deploy status → /colophon</a>
  {#if data.firstDate}
    · earliest pending: {formatDate(data.firstDate)}
  {/if}
</p>

{#if data.error}
  <div class="error">
    <p>{data.error}</p>
  </div>
{:else if data.count === 0}
  <div class="empty">
    <p>✓ all local commits are pushed. nothing pending.</p>
  </div>
{:else}
  <div class="summary-line">
    {#each nonEmptyCats as cat}
      <span class="summary-chip">{data.categoryLabels[cat]}: {data.totals[cat]}</span>
    {/each}
  </div>

  {#each nonEmptyCats as cat}
    <section class="category-group" data-category={cat}>
      <h2>{data.categoryLabels[cat]} <span class="count-badge">{data.categories[cat].length}</span></h2>
      <ol class="commit-list">
        {#each data.categories[cat] as commit}
          <li class="commit-item">
            <span class="commit-subject">{commit.subject}</span>
            {#if commit.date}
              <span class="commit-date">
                <span class="stale-dot {stalenessClass(commit.daysSince)}"></span>
                {formatDate(commit.date)}
                {#if commit.daysSince !== null && commit.daysSince > 0}
                  <span class="stale-label {stalenessClass(commit.daysSince)}">{commit.daysSince}d stale</span>
                {/if}
              </span>
            {/if}
            <code class="commit-hash">{commit.hash}</code>
          </li>
        {/each}
      </ol>
    </section>
  {/each}

  <div class="note">
    <p>these commits are local-only until the git pat is refreshed and a push happens. see <a href="/colophon">/colophon</a> for stack details.</p>
  </div>
{/if}

<style>
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .lede {
    color: #58a6ff;
    margin-bottom: 1rem;
  }

  .status {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
  }

  .status-badge {
    font-size: 0.8rem;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  .status-badge.count {
    color: #e6a817;
    background: rgba(230, 168, 23, 0.12);
  }

  .status-badge.range {
    color: var(--muted, #888);
    background: rgba(136, 136, 136, 0.08);
  }

  .status-badge.stalest {
    color: #f85149;
    background: rgba(248, 81, 73, 0.1);
  }

  .meta {
    font-size: 0.8rem;
    color: var(--muted, #888);
    margin-bottom: 1.5rem;
  }

  .meta a {
    color: #58a6ff;
  }

  .error, .empty {
    padding: 1rem;
    background: rgba(248, 81, 73, 0.05);
    border: 1px solid rgba(248, 81, 73, 0.2);
    border-radius: 4px;
    color: var(--muted, #bbb);
  }

  .empty {
    border-color: rgba(46, 160, 67, 0.2);
    background: rgba(46, 160, 67, 0.05);
  }

  .stale-severe { color: #f85149; }
  .stale-warning { color: #e6a817; }
  .stale-mild { color: #8b949e; }
  .stale-fresh { color: #3fb950; }

  .stale-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 0.3rem;
    flex-shrink: 0;
  }

  .summary-line {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1.5rem;
  }

  .summary-chip {
    font-size: 0.78rem;
    padding: 0.15rem 0.5rem;
    background: rgba(88, 166, 255, 0.08);
    border: 1px solid rgba(88, 166, 255, 0.15);
    border-radius: 3px;
    color: #c9d1d9;
  }

  section {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1rem;
    color: #58a6ff;
    font-weight: 400;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .count-badge {
    font-size: 0.75rem;
    color: var(--muted, #888);
    background: rgba(136, 136, 136, 0.08);
    padding: 0.05rem 0.35rem;
    border-radius: 3px;
  }

  .commit-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .commit-item {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
    padding: 0.25rem 0 0.25rem 0.75rem;
    border-left: 2px solid rgba(88, 166, 255, 0.12);
    margin-bottom: 0.15rem;
    font-size: 0.85rem;
  }

  .commit-subject {
    flex: 1;
    color: #c9d1d9;
  }

  .commit-date {
    color: var(--muted, #888);
    font-size: 0.76rem;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .stale-label {
    font-size: 0.7rem;
    padding: 0.05rem 0.3rem;
    border-radius: 2px;
    background: rgba(136, 136, 136, 0.08);
  }

  .stale-severe .stale-label,
  .stale-label.stale-severe {
    background: rgba(248, 81, 73, 0.12);
  }

  .stale-label.stale-warning {
    background: rgba(230, 168, 23, 0.12);
  }

  .stale-label.stale-mild {
    background: rgba(139, 148, 158, 0.1);
  }

  .stale-label.stale-fresh {
    background: rgba(63, 185, 80, 0.1);
  }

  .commit-hash {
    font-size: 0.72rem;
    color: #555;
    background: #1a1a1a;
    padding: 0.05rem 0.3rem;
    border-radius: 2px;
    white-space: nowrap;
    font-family: 'courier new', courier, monospace;
  }

  .note {
    margin-top: 2rem;
    padding: 0.75rem;
    background: rgba(230, 168, 23, 0.05);
    border: 1px solid rgba(230, 168, 23, 0.15);
    border-radius: 4px;
    font-size: 0.8rem;
    color: var(--muted, #bbb);
  }

  .note a {
    color: #58a6ff;
  }
</style>
