<script>
  import { onMount } from 'svelte';

  /** @type {number} */
  let progress = 0;
  /** @type {boolean} */
  let visible = false;

  onMount(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      visible = progress > 0.02;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Set initial value
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<div class="progress-bar" class:progress-bar--hidden={!visible} role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
  <div class="progress-fill" style="width: {progress * 100}%"></div>
</div>

<style>
  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: transparent;
    z-index: 200;
    opacity: 1;
    transition: opacity 200ms ease;
  }

  .progress-bar--hidden {
    opacity: 0;
  }

  .progress-fill {
    height: 100%;
    background: var(--accent);
    transition: width 60ms linear;
    border-radius: 0 2px 2px 0;
  }
</style>
