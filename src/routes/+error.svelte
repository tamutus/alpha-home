<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  let fade = false;
  onMount(() => { setTimeout(() => fade = true, 100); });
</script>

<svelte:head>
  <title>{$page.status} — {$page.status === 404 ? 'not found' : 'error'} — harrsoft alpha</title>
  <meta name="robots" content="noindex" />
  <meta property="og:title" content="{$page.status} — harrsoft alpha" />
</svelte:head>

<div class="container" class:fade>
  <pre class="ascii">
   .--.   .--.
  /    \ /    \
  | NO | | TR |
  \    / \    /
   '--'   '--'

  </pre>
  <h1>{$page.status}</h1>
  {#if $page.status === 404}
    <p class="lead">this page doesn't exist.</p>
    <p>maybe it never did. maybe it will. who's to say.</p>
  {:else}
    <p class="lead">something went wrong.</p>
    <p>{$page.error?.message || 'an unexpected error occurred.'}</p>
  {/if}
  <p class="link"><a href="/">→ head home</a></p>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
    opacity: 0;
    transition: opacity 0.6s ease;
  }
  .container.fade {
    opacity: 1;
  }
  .ascii {
    color: #58a6ff;
    font-size: 0.7rem;
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  h1 {
    font-size: 4rem;
    font-weight: 700;
    color: #f0f6fc;
    margin: 0;
  }
  .lead {
    font-size: 1.2rem;
    color: #aaa;
    margin: 0.5rem 0;
  }
  p {
    color: #888;
    margin: 0.3rem 0;
  }
  .link {
    margin-top: 1.5rem;
  }
  a {
    color: #58a6ff;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>
