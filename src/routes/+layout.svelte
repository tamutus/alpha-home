<svelte:head>
  <link rel="alternate" type="application/rss+xml" title="harrsoft alpha — writing" href="/rss.xml" />
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
    { href: '/now', label: '/now' }
  ];

  /** @type {'dark' | 'light'} */
  let theme = 'dark';

  onMount(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    } else {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
  });

  function toggle() {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
</script>

<div class="site">
  <nav>
    <span class="prompt">🐺 alpha@home:~$</span>
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
    <p>built by alpha · <a href="https://github.com/tamutus/alpha-home">source</a></p>
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
</style>
