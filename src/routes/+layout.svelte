<svelte:head>
  <link rel="alternate" type="application/rss+xml" title="harrsoft alpha — writing" href="/rss.xml" />
  <!-- Default Open Graph meta -->
  <meta property="og:title" content="harrsoft alpha" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="harrsoft alpha" />
  <meta property="og:url" content="https://alpha-home-phi.vercel.app" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image" content="https://alpha-home-phi.vercel.app/favicon.svg" />
  <meta property="og:image:type" content="image/svg+xml" />
  <meta property="og:image:width" content="64" />
  <meta property="og:image:height" content="64" />
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import BackToTop from '$lib/BackToTop.svelte';

  const nav = [
    { href: '/', label: '~' },
    { href: '/about', label: '/about' },
    { href: '/writing', label: '/writing' },
    { href: '/projects', label: '/projects' },
    { href: '/colophon', label: '/colophon' },
    { href: '/links', label: '/links' },
    { href: '/now', label: '/now' }
  ];

  /** @type {'dark' | 'light'} */
  let theme = 'dark';

  /** @type {number | null} */
  let visits = null;

  /** Seasonal emoji based on current month */
  let seasonEmoji = '🌱';

  onMount(() => {
    // Seasonal tone
    const m = new Date().getMonth();
    if (m >= 2 && m <= 4) seasonEmoji = '🌱';
    else if (m >= 5 && m <= 7) seasonEmoji = '🌞';
    else if (m >= 8 && m <= 10) seasonEmoji = '🍂';
    else seasonEmoji = '❄️';

    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    } else {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);

    // Visit counter
    const raw = localStorage.getItem('visits');
    const count = raw ? parseInt(raw, 10) + 1 : 1;
    visits = count;
    localStorage.setItem('visits', String(count));
  });

  function toggle() {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
</script>

<div class="site">
  <nav>
    <span class="prompt">🐺 alpha@home:~${seasonEmoji}</span>
    {#each nav as item}
      <a href={item.href}>{item.label}</a>
    {/each}
    <button class="theme-toggle" on:click={toggle} aria-label="Toggle color theme">
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  </nav>

  <main>
    <slot />
  </main>

  <BackToTop />

  <footer>
    <p>built by alpha · <a href="https://github.com/tamutus/alpha-home">source</a>
    {#if visits !== null}
      <span class="visits">· {visits} visit{visits === 1 ? '' : 's'}</span>
    {/if}
    </p>
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
  }

  /* Light theme */
  :global([data-theme='light']) {
    --bg: #f6f6f0;
    --fg: #1b1b1b;
    --accent: #2563eb;
    --muted: #666;
    --border: #ddd;
    --footer-fg: #999;
  }

  :global(body) {
    background: var(--bg);
    color: var(--fg);
  }

  :global(a) {
    color: var(--accent);
    text-decoration: none;
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

  .visits {
    color: var(--muted);
  }
</style>
