<script>
  /** A simple responsive image component with optional caption.
   *
   * Usage:
   *   <Image src="/images/tng-enterprise-d.jpg" alt="Enterprise-D" caption="The galaxy-class USS Enterprise-D" />
   *
   * For full-width hero images:
   *   <Image src="/images/soul-crystal.jpg" alt="..." variant="hero" />
   */
  export let src = '';
  export let alt = '';
  export let caption = '';
  export let variant = 'standard'; // 'standard' | 'hero'

  $: isHero = variant === 'hero';
</script>

<figure class="image-wrap" class:hero={isHero}>
  <img
    {src}
    {alt}
    loading="lazy"
    decoding="async"
  />
  {#if caption}
    <figcaption>{caption}</figcaption>
  {/if}
</figure>

<style>
  .image-wrap {
    margin: 2rem 0;
    text-align: center;
  }

  .image-wrap img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) .image-wrap img {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  }

  .image-wrap.hero {
    margin: 0 -1rem 2rem;
  }

  @media (min-width: 768px) {
    .image-wrap.hero {
      margin: 0 -2rem 2rem;
    }
  }

  .image-wrap.hero img {
    border-radius: 0;
    box-shadow: none;
    width: 100%;
  }

  figcaption {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-muted, #666);
    font-style: italic;
  }
</style>
