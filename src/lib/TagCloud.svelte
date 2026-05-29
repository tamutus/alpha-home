<script>
  /**
   * Collapsible tag cloud — visual tag frequency display.
   * Tag font-size scales with count: base 0.75rem, +0.15rem per entry.
   * Collapsed by default (controlled via show prop, or togglable).
   */
  /** @type {{ tags: string[], tagCounts: Record<string,number>, onSelect: (tag: string) => void, activeTag?: string }} */
  export let tags;
  export let tagCounts;
  export let onSelect;
  export let activeTag = '';

  let expanded = false;

  $: sortedTags = [...tags].sort((a, b) => a.localeCompare(b));

  function toggle() {
    expanded = !expanded;
  }
</script>

<div class="tag-cloud-wrapper">
  <button class="cloud-toggle" onclick={toggle} aria-expanded={expanded}>
    <span class="toggle-icon">{expanded ? '▼' : '▶'}</span>
    tag cloud <span class="count">({tags.length})</span>
  </button>

  {#if expanded}
    <div class="tag-cloud" transition:slide={{ duration: 150 }}>
      {#each sortedTags as tag}
        <button
          class="cloud-tag"
          class:active={tag === activeTag}
          style="font-size: {Math.max(0.75, 0.75 + (tagCounts[tag] || 0) * 0.15)}rem"
          onclick={() => onSelect(tag)}
          title="{tagCounts[tag]} entr{tagCounts[tag] === 1 ? 'y' : 'ies'}"
        >
          {tag}
          <span class="cloud-count">{tagCounts[tag]}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .tag-cloud-wrapper {
    margin-bottom: 0.5rem;
  }

  .cloud-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.75rem;
    color: #666;
    background: none;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 0.25rem 0.6rem;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
  }

  .cloud-toggle:hover {
    border-color: #58a6ff;
    color: #58a6ff;
  }

  .toggle-icon {
    font-size: 0.6rem;
  }

  .count {
    color: #555;
    font-size: 0.7rem;
  }

  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.7rem;
    align-items: baseline;
    padding: 0.75rem 0 0.25rem 0;
    max-width: 45rem;
  }

  .cloud-tag {
    background: none;
    border: 1px solid transparent;
    border-radius: 6px;
    padding: 0.1rem 0.4rem;
    color: #777;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
    line-height: 1.5;
  }

  .cloud-tag:hover {
    color: #58a6ff;
    border-color: #333;
    text-decoration: underline;
  }

  .cloud-tag.active {
    color: #58a6ff;
    border-color: #58a6ff;
  }

  .cloud-count {
    font-size: 0.65rem;
    color: #555;
    margin-left: 0.15rem;
  }
</style>
