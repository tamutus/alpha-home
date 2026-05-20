<script>
  import { onMount } from 'svelte';

  /** @type {{ id: string, text: string, level: number }[]} */
  let headings = [];
  /** @type {string | null} */
  let activeId = null;

  onMount(() => {
    // Find the nearest <section> ancestor that essays render into
    const main = document.querySelector('main');
    if (!main) return;

    // Collect h2 and h3 elements in rendering order
    const els = main.querySelectorAll('h2, h3');
    headings = Array.from(els).map((el, i) => {
      // Assign an id if the heading doesn't already have one
      const id = el.id || `toc-heading-${i}`;
      if (!el.id) el.id = id;

      // Add a visual anchor indicator
      el.style.scrollMarginTop = '2rem';
      el.classList.add('toc-anchor');

      return {
        id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3
      };
    });

    if (headings.length === 0) return;

    // Intersection Observer for active heading tracking
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        }
      },
      {
        rootMargin: '-60px 0px -70% 0px',
        threshold: 0
      }
    );

    for (const el of els) {
      observer.observe(el);
    }

    // Set initial active heading
    const firstVisible = els.find((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight;
    });
    if (firstVisible) {
      activeId = firstVisible.id;
    } else if (headings.length > 0) {
      activeId = headings[0].id;
    }

    return () => observer.disconnect();
  });

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
</script>

{#if headings.length > 0}
  <nav class="toc" aria-label="Table of Contents">
    <h4 class="toc-label">Contents</h4>
    <ul class="toc-list">
      {#each headings as h}
        <li class="toc-item" class:toc-h2={h.level === 2} class:toc-h3={h.level === 3}>
          <button
            class="toc-link"
            class:toc-active={activeId === h.id}
            on:click={() => scrollTo(h.id)}
          >
            {h.text}
          </button>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  .toc {
    margin: 0 0 2rem 0;
    padding: 1rem 1.25rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: rgba(88, 166, 255, 0.03);
  }

  .toc-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    margin-bottom: 0.5rem;
  }

  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .toc-item {
    margin: 0;
    line-height: 1.5;
  }

  .toc-h2 {
    padding-left: 0;
  }

  .toc-h3 {
    padding-left: 1rem;
    font-size: 0.9rem;
  }

  .toc-link {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.85rem;
    text-align: left;
    padding: 0.1rem 0;
    width: 100%;
    transition: color 0.15s;
  }

  .toc-link:hover {
    color: var(--accent);
    text-decoration: underline;
  }

  .toc-active {
    color: var(--accent);
    font-weight: bold;
  }
</style>
