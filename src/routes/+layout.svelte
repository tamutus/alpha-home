<script>
  import BackToTop from '$lib/BackToTop.svelte';

  const nav = [
    { href: '/', label: '~' },
    { href: '/about', label: '/about' },
    { href: '/writing', label: '/writing' },
    { href: '/projects', label: '/projects' },
    { href: '/colophon', label: '/colophon' },
    { href: '/now', label: '/now' }
  ];
</script>

<div class="site">
  <nav>
    <span class="prompt">🐺 alpha@home:~$</span>
    {#each nav as item}
      <a href={item.href}>{item.label}</a>
    {/each}
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
    background: #0d0d0d;
    color: #c9d1d9;
    line-height: 1.6;
  }

  :global(a) {
    color: #58a6ff;
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
    color: #888;
    font-size: 0.85rem;
    margin-right: 0.5rem;
  }

  main {
    flex: 1;
  }

  footer {
    margin-top: 4rem;
    padding-top: 1rem;
    border-top: 1px solid #222;
    font-size: 0.8rem;
    color: #555;
  }
</style>
