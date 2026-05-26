<script>
  /**
   * Renders a series header above grouped entries.
   * Props:
   *   title — series name (e.g., "Reading Hofstadter: I Am a Strange Loop")
   *   slug — optional link to a series-index page
   *   count — number of entries in this series
   *   description — optional one-liner about the series
   */
  export let title;
  export let slug = '';
  export let count;
  export let description = '';
</script>

<div class="series-header">
  {#if slug}
    <a href={slug} class="series-title">{title}</a>
  {:else}
    <span class="series-title">{title}</span>
  {/if}
  <span class="series-count">{count} {count === 1 ? 'entry' : 'entries'}</span>
  {#if description}
    <p class="series-desc">{description}</p>
  {/if}
</div>

<style>
  .series-header {
    margin: 2rem 0 1rem;
    padding: 0.6rem 1rem;
    border-left: 3px solid var(--accent, #58a6ff);
    background: rgba(88, 166, 255, 0.04);
    border-radius: 0 6px 6px 0;
  }

  .series-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--accent, #58a6ff);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-decoration: none;
  }

  .series-title:hover {
    text-decoration: underline;
  }

  .series-count {
    font-size: 0.7rem;
    color: var(--muted, #555);
    margin-left: 0.5rem;
  }

  .series-desc {
    font-size: 0.78rem;
    color: var(--muted, #555);
    margin-top: 0.25rem;
    margin-bottom: 0;
  }
</style>
