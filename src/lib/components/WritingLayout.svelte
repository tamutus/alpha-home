<script>
  import WritingLayout from '$lib/writing-layout.svelte';

  /**
   * Thin compatibility wrapper around $lib/writing-layout.svelte.
   *
   * Supports two call styles:
   *   1. <WritingLayout metadata={{ title, date, tags, excerpt, theme }}> (essays)
   *   2. <WritingLayout title="..." date="..." subtitle="..." series="..." ...> (journal pages)
   *
   * For style 2, unknown extra props (subtitle, series, episode, j, starDate,
   * seasonWordCount) are intentionally ignored — the base layout doesn't render
   * them. title/date/tags/desc/theme are mapped through when present.
   */

  /** @type {{ metadata?: { title?: string, date?: string, tags?: string[], excerpt?: string, theme?: string } }} */
  export let metadata = undefined;

  export let title = '';
  export let date = '';
  export let tags = [];
  export let desc = '';
  export let theme = '';

  $: resolvedTitle = title || metadata?.title || '';
  $: resolvedDate = date || metadata?.date || '';
  $: resolvedTags = (tags && tags.length) ? tags : (metadata?.tags || []);
  $: resolvedDesc = desc || metadata?.excerpt || '';
  $: resolvedTheme = theme || metadata?.theme || '';
</script>

<WritingLayout
  title={resolvedTitle}
  date={resolvedDate}
  tags={resolvedTags}
  desc={resolvedDesc}
  theme={resolvedTheme}
>
  <slot />
</WritingLayout>
