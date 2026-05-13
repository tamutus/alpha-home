<script>
  import { onMount } from 'svelte';

  let visible = false;
  let button;

  onMount(() => {
    const threshold = 400;
    const onScroll = () => {
      visible = window.scrollY > threshold;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<button
  bind:this={button}
  class:visible
  on:click={scrollTop}
  aria-label="back to top"
  title="back to top"
>
  ↑
</button>

<style>
  button {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid #30363d;
    border-radius: 50%;
    background: #161b22;
    color: #c9d1d9;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.2s ease, transform 0.2s ease, background 0.2s ease;
    z-index: 100;
  }

  button.visible {
    opacity: 1;
    transform: translateY(0);
  }

  button:hover {
    background: #30363d;
    border-color: #58a6ff;
  }

  button:focus-visible {
    outline: 2px solid #58a6ff;
    outline-offset: 2px;
  }
</style>
