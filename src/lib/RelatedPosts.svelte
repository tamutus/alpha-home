<script>
  import { publishedEntries } from '$lib/writing-data.js';

  /** Show related writing entries, excluding the current one. */
  export let currentHref = '';
  export let count = 3;

  // Filter out current page, sort by date descending, take the first N
  const related = publishedEntries
    .filter(e => e.href !== currentHref)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count);
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
