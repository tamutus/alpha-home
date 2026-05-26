<script>
  import { publishedEntries } from '$lib/writing-data.js';

  /** Show related writing entries based on tag similarity, excluding the current one. */
  export let currentHref = '';
  export let count = 3;

  // Find the current entry to get its tags
  const current = publishedEntries.find(e => e.href === currentHref);

  /** Score similarity between two entries: tag overlap + word-proximity bonus */
  function similarity(a, b) {
    const aTags = new Set(a.tags);
    const bTags = new Set(b.tags);
    let overlap = 0;
    for (const tag of aTags) {
      if (bTags.has(tag)) overlap++;
    }
    if (overlap === 0) return 0;

    // Word-proximity bonus: entries closer in length feel more similar in scope
    const wordDiff = Math.abs(a.words - b.words);
    const wordBonus = Math.max(0, 1 - wordDiff / 2000);

    // Normalize overlap against the smaller tag set
    const denom = Math.min(aTags.size, bTags.size);
    const tagScore = overlap / Math.max(denom, 1);

    return tagScore * 0.85 + wordBonus * 0.15;
  }

  let related;
  if (current) {
    const others = publishedEntries.filter(e => e.href !== currentHref);
    const scored = others
      .map(e => ({ entry: e, score: similarity(current, e) }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);

    // Ensure we get count entries: fill with top date-sorted if similarity is sparse
    related = scored.slice(0, count).map(s => s.entry);
    if (related.length < count) {
      const usedHrefs = new Set(related.map(r => r.href));
      const fillers = others
        .filter(e => !usedHrefs.has(e.href))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, count - related.length);
      related = [...related, ...fillers];
    }
  } else {
    // Fallback: current entry not found (e.g. on a non-writing page)
    related = publishedEntries
      .filter(e => e.href !== currentHref)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, count);
  }
</script>

{#if related.length > 0}
  <div class="related-posts">
    <h3>more writing</h3>
    <ul>
      {#each related as entry}
        <li>
          <a href={entry.href}>{entry.title}</a>
          <span class="date">{entry.date}</span>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .related-posts {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border, #333);
  }

  h3 {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-muted, #888);
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.6rem;
    line-height: 1.4;
  }

  a {
    font-size: 0.95rem;
  }

  .date {
    display: block;
    font-size: 0.75rem;
    color: var(--color-text-muted, #666);
  }
</style>
