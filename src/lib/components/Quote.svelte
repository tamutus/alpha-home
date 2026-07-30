<script>
  /** @type {{ source?: string, children?: import('svelte').Snippet }} */
  let { source, children } = $props();
</script>

<blockquote class="styled-quote">
  {#if children}
    {@render children()}
  {/if}
  {#if source}
    <footer>— {source}</footer>
  {/if}
</blockquote>

<style>
  .styled-quote {
    border-left: 3px solid var(--color-accent, #b8860b);
    padding: 0.75rem 1.25rem;
    margin: 1.25rem 0;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0 4px 4px 0;
  }
  .styled-quote :global(p) {
    margin: 0;
  }
  footer {
    margin-top: 0.5rem;
    font-style: italic;
    color: var(--color-muted, #888);
    font-size: 0.9em;
  }
</style>
