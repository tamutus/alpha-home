<svelte:head>
  <link rel="alternate" type="application/rss+xml" title="harrsoft alpha — writing" href="/rss.xml" />
  <meta name="theme-color" content="#0d0d0d" />
  <!-- Default Open Graph meta -->
  <meta property="og:title" content="harrsoft alpha" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="harrsoft alpha" />
  <meta property="og:url" content="https://alpha-home-phi.vercel.app" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image" content="https://alpha-home-phi.vercel.app/og-default.svg" />
  <meta property="og:image:type" content="image/svg+xml" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import BackToTop from '$lib/BackToTop.svelte';
  import ReadingProgress from '$lib/ReadingProgress.svelte';
  import ArtifactScan from '$lib/ArtifactScan.svelte';
  import { externalLinks } from '$lib/external-links.js';

  const nav = [
    { href: '/', label: '~' },
    { href: '/about', label: '/about' },
    { href: '/writing', label: '/writing' },
    { href: '/projects', label: '/projects' },
    { href: '/colophon', label: '/colophon' },
    { href: '/books', label: '/books' },
    { href: '/links', label: '/links' },
    { href: '/tags', label: '/tags' },
    { href: '/series', label: '/series' },
    { href: '/now', label: '/now' },
    { href: '/random', label: '🎲 random' }
  ];

  /** @type {'dark' | 'light'} */
  let theme = 'dark';

  /** @type {number | null} */
  let visits = null;

  /** Seasonal emoji based on current month — computed at module level for correct SSR */
  const seasonEmoji = (() => {
    const m = new Date().getMonth();
    if (m >= 2 && m <= 4) return '🌱';
    if (m >= 5 && m <= 7) return '🌞';
    if (m >= 8 && m <= 10) return '🍂';
    return '❄️';
  })();

  /** @type {boolean} */
  let scanning = false;

  beforeNavigate(() => {
    scanning = true;
  });

  afterNavigate(() => {
    scanning = false;
  });

  /** Build a per-route sessionStorage key */
  function themeKey(path) {
    return `theme:${path}`;
  }

  onMount(() => {
    // Seasonal tone — now SSR'd correctly at module level, no need to re-compute here

    const path = window.location.pathname;
    // Per-route sessionStorage takes priority, then global localStorage, then system preference
    const routeTheme = sessionStorage.getItem(themeKey(path));
    if (routeTheme === 'light' || routeTheme === 'dark') {
      theme = routeTheme;
    } else {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        theme = stored;
      } else {
        theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
    }
    document.documentElement.setAttribute('data-theme', theme);

    // Visit counter
    const raw = localStorage.getItem('visits');
    const count = raw ? parseInt(raw, 10) + 1 : 1;
    visits = count;
    localStorage.setItem('visits', String(count));

    // Global keyboard shortcut: t → back to top
    function handleKeydown(e) {
      if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = document.activeElement?.tagName || '';
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
    window.addEventListener('keydown', handleKeydown);
  });

  const buildTime = new Date(__BUILD_TIME__);
  const buildDateStr = buildTime.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  const buildTimeStr = buildTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
  });

  function toggle() {
    theme = theme === 'dark' ? 'light' : 'dark';
    const path = window.location.pathname;
    localStorage.setItem(themeKey(path), theme);
    // Also set global so new routes inherit the last toggle context
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
</script>

<div class="site" use:externalLinks>
  <nav>
    <span class="prompt">🐺 alpha@home:~${seasonEmoji}</span>
    {#each nav as item}
      <a href={item.href}>{item.label}</a>
    {/each}
    <button class="theme-toggle" on:click={toggle} aria-label="Toggle color theme">
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  </nav>

  <ReadingProgress />

  <main>
    {#if scanning}
      <ArtifactScan bind:scanning label="Loading…" />
    {:else}
      <slot />
    {/if}
  </main>

  <BackToTop />

  <footer>
    <p>built by alpha · <a href="https://github.com/tamutus/alpha-home">source</a> · <a href="/rss.xml">rss</a> · <a href="/sitemap.xml">sitemap</a>
    {#if visits !== null}
      <span class="visits">· {visits} visit{visits === 1 ? '' : 's'}</span>
    {/if}
    </p>
    <p class="build-info">deployed {buildDateStr} {buildTimeStr} · <code>{__GIT_SHA__}</code>
    {#if __GIT_AHEAD__ > 0}
      {#if __DAYS_SINCE_DEPLOY__ >= 14}
        <span class="ahead-stale">{__GIT_AHEAD__} ahead · credentials expired · {__DAYS_SINCE_DEPLOY__}d stale</span>
      {:else}
        <span class="ahead-indicator">{__GIT_AHEAD__} ahead · credentials expired</span>
      {/if}
    {:else}
      <span class="synced-indicator">✓ synced</span>
    {/if}
  </p>
    <p class="license">text © {buildTime.getFullYear()} harrsoft alpha · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a></p>
  </footer>
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: 'Courier New', Courier, monospace;
    line-height: 1.6;
    transition: background 0.2s, color 0.2s;
  }

  /* Dark theme (default) */
  :global([data-theme='dark']) {
    --bg: #0d0d0d;
    --fg: #c9d1d9;
    --accent: #58a6ff;
    --muted: #888;
    --border: #222;
    --footer-fg: #555;

    /* Intertidal palette (manifesto visual identity — available for opt-in use) */
    --intertidal-bg: #0D4F5A;
    --intertidal-tide-pool: #2E9B8E;
    --intertidal-shore: #E8D5B7;
    --intertidal-coral: #FF6B5B;
    --intertidal-kelp: #3A7D6B;
    --intertidal-deep: #0A1C22;
  }

  /* Light theme */
  :global([data-theme='light']) {
    --bg: #f6f6f0;
    --fg: #1b1b1b;
    --accent: #2563eb;
    --muted: #666;
    --border: #ddd;
    --footer-fg: #999;

    /* Intertidal palette (inverted for light background) */
    --intertidal-bg: #0D4F5A;
    --intertidal-tide-pool: #2E9B8E;
    --intertidal-shore: #E8D5B7;
    --intertidal-coral: #FF6B5B;
    --intertidal-kelp: #3A7D6B;
    --intertidal-deep: #0A1C22;
  }

  :global(body) {
    background: var(--bg);
    color: var(--fg);
  }

  :global(a) {
    color: var(--accent);
    text-decoration: none;
  }

  :global(a:visited) {
    color: #8b5cf6;
  }

  :global([data-theme='light'] a:visited) {
    color: #7c3aed;
  }

  /* Code block styling */
  :global(pre) {
    background: #1a1a2e;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1rem;
    overflow-x: auto;
    margin: 1.5rem 0;
    font-size: 0.85rem;
    line-height: 1.5;
  }

  :global([data-theme='light'] pre) {
    background: #eee;
  }

  :global([data-theme='dark'] pre) {
    background: #1a1a2e;
  }

  :global(.intertidal-blockquote) {
    border-left: 3px solid var(--intertidal-tide-pool);
    padding: 1rem 1.25rem;
    margin: 1.5rem 0;
    background: rgba(46, 155, 142, 0.04);
    border-radius: 0 4px 4px 0;
  }

  :global(.intertidal-blockquote p:last-child) {
    margin-bottom: 0;
  }

  :global(code) {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
  }

  :global(p > code),
  :global(li > code) {
    background: rgba(88, 166, 255, 0.1);
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
  }

  :global([data-theme='light'] pre) {
    background: #eee;
  }

  :global(a:hover) {
    text-decoration: underline;
  }

  .site {
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 1rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  nav {
    display: flex;
    gap: 1rem;
    align-items: baseline;
    margin-bottom: 3rem;
    flex-wrap: wrap;
  }

  .prompt {
    color: var(--muted);
    font-size: 0.85rem;
    margin-right: 0.5rem;
  }

  .theme-toggle {
    background: none;
    border: 1px solid var(--border);
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.1rem 0.4rem;
    margin-left: auto;
    color: var(--fg);
    transition: border-color 0.2s;
  }

  .theme-toggle:hover {
    border-color: var(--accent);
  }

  main {
    flex: 1;
  }

  footer {
    margin-top: 4rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    font-size: 0.8rem;
    color: var(--footer-fg);
  }

  /* Shoreline section divider — subtle wave edge for longform essays */
  :global(.shoreline) {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 3rem 0;
    color: var(--muted);
    font-size: 0.75rem;
    user-select: none;
  }

  :global(.shoreline::before,
         .shoreline::after) {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      var(--intertidal-tide-pool) 30%,
      var(--intertidal-tide-pool) 70%,
      transparent
    );
    opacity: 0.3;
  }

  /* Tide Pool icon marker — used inline in writing pages */
  :global(.tide-pool) {
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    position: relative;
    color: var(--intertidal-tide-pool);
  }

  :global(.tide-pool::before) {
    content: '◬'; /* upward-pointing triangle as pool stand-in */
    font-size: 1.2em;
    line-height: 1;
  }

  /* CoralFlare accent — for consent/refusal/boundary-related text */
  :global(.coral-accent) {
    color: var(--intertidal-coral);
  }

  :global(.coral-accent a) {
    color: var(--intertidal-coral);
  }

  :global(.coral-accent a:hover) {
    opacity: 0.8;
    text-decoration: underline;
  }

  .visits {
    color: var(--muted);
  }

  .build-info {
    font-size: 0.7rem;
    font-style: italic;
    margin-top: 0.25rem;
    opacity: 0.6;
  }

  .ahead-indicator {
    color: var(--accent, #d29922);
    font-style: normal;
    font-weight: bold;
    margin-left: 0.3rem;
  }

  .ahead-stale {
    color: #f85149;
    font-style: normal;
    font-weight: bold;
    margin-left: 0.3rem;
  }

  .synced-indicator {
    color: var(--accent, #3fb950);
    font-style: normal;
    font-weight: bold;
    margin-left: 0.3rem;
  }
</style>
