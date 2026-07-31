<script>
  import { page } from '$app/stores';
  import { publishedEntries } from '$lib/writing-data';

  // Enumerate journal route dirs at build time — source of truth for what's browsable.
  const journalRoutes = import.meta.glob('/src/routes/writing/journal-*/+page.*');

  /**
   * Build the flat journal sequence ordered by journal number (cross-series:
   * TNG 1-228 → DS9 229-365 → Voyager 366+). Duplicate-number dirs (legacy
   * bare + suffixed variants) resolve to the registered slug when one exists,
   * else the suffixed one.
   */
  const byNumber = new Map();
  for (const path of Object.keys(journalRoutes)) {
    const slug = path.split('/').slice(-2)[0];
    const m = slug.match(/^journal-(\d+)/);
    if (!m) continue;
    const num = parseInt(m[1], 10);
    const registered = publishedEntries.some((e) => e.slug === slug);
    const existing = byNumber.get(num);
    if (!existing || (registered && !existing.registered)) {
      byNumber.set(num, { num, slug, registered });
    }
  }

  const journals = [...byNumber.values()].sort((a, b) => a.num - b.num);

  const titleFor = (slug) => {
    const e = publishedEntries.find((x) => x.slug === slug);
    return e ? e.title : null;
  };

  $: currentSlug = $page.url.pathname.match(/\/writing\/(journal-\d+(?:-[a-z0-9-]+)?)/)?.[1] ?? null;
  $: idx = currentSlug ? journals.findIndex((j) => j.slug === currentSlug) : -1;
  $: prev = idx > 0 ? journals[idx - 1] : null;
  $: next = idx >= 0 && idx < journals.length - 1 ? journals[idx + 1] : null;
  $: total = journals.length;
</script>

<slot />

{#if prev || next}
  <nav class="journal-nav" aria-label="Journal navigation">
    {#if prev}
      <a class="journal-nav-link" href={`/writing/${prev.slug}`} title={titleFor(prev.slug) ?? `Journal ${prev.num}`}>
        <span class="arrow">←</span>
        <span class="label">J-{prev.num}</span>
      </a>
    {:else}
      <span></span>
    {/if}
    {#if next}
      <a class="journal-nav-link next" href={`/writing/${next.slug}`} title={titleFor(next.slug) ?? `Journal ${next.num}`}>
        <span class="label">J-{next.num}</span>
        <span class="arrow">→</span>
      </a>
    {:else}
      <span></span>
    {/if}
  </nav>
{/if}

<style>
  .journal-nav {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #1a1a1a;
  }

  .journal-nav-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    border: 1px solid #30363d;
    border-radius: 6px;
    background: #161b22;
    color: #c9d1d9;
    font-size: 0.85rem;
    text-decoration: none;
    transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
  }

  .journal-nav-link:hover {
    border-color: #58a6ff;
    color: #58a6ff;
    background: #1c2128;
  }

  .journal-nav-link.next {
    margin-left: auto;
  }

  .arrow {
    color: #777;
    transition: color 0.2s ease;
  }

  .journal-nav-link:hover .arrow {
    color: #58a6ff;
  }

  .label {
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 480px) {
    .journal-nav-link {
      font-size: 0.8rem;
      padding: 0.4rem 0.7rem;
    }
  }
</style>
