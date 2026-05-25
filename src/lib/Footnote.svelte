<script>
  /** Inline footnote — renders a superscript reference with a popover on hover/focus.
   *
   * Usage:
   *   <Footnote ref="1">
   *     Reference: Star Trek TNG S2E20 — "The Emissary"
   *   </Footnote>
   *
   * Each footnote on a page should use a unique `ref` value. Duplicates are fine
   * (same text, same anchor target), but uniqueness avoids ambiguity.
   */
  export let ref = '';

  let open = false;
  let timeout;

  function show() {
    clearTimeout(timeout);
    open = true;
  }

  function hide() {
    timeout = setTimeout(() => { open = false; }, 300);
  }

  /** keep popover open when hovering it, so user can click links inside */
  function keep() {
    clearTimeout(timeout);
    open = true;
  }
</script>

<span class="footnote-ref" on:mouseenter={show} on:mouseleave={hide}>
  <sup><a href="#fn-{ref}" on:focus={show} on:blur={hide} role="doc-noteref">[{ref}]</a></sup>
  {#if open}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span class="footnote-popover" on:mouseenter={keep} on:mouseleave={hide} role="tooltip">
      <slot />
    </span>
  {/if}
</span>

<style>
  .footnote-ref {
    position: relative;
    display: inline;
  }
  .footnote-ref sup a {
    color: var(--accent, #58a6ff);
    text-decoration: none;
    cursor: pointer;
  }
  .footnote-ref sup a:hover {
    text-decoration: underline;
  }
  .footnote-popover {
    position: absolute;
    bottom: 1.5em;
    left: 0;
    z-index: 100;
    max-width: min(28em, 85vw);
    padding: 0.6em 0.9em;
    background: var(--bg-secondary, #1a1a2e);
    border: 1px solid var(--border, #333);
    border-radius: 6px;
    font-size: 0.875rem;
    line-height: 1.45;
    color: var(--text-secondary, #ccc);
    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
  }
  .footnote-popover :global(em) {
    font-style: italic;
  }
  .footnote-popover :global(a) {
    color: var(--accent, #58a6ff);
  }
</style>
