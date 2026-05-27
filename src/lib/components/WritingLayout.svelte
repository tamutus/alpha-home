<script>
  import WritingLayout from '$lib/writing-layout.svelte';

  /** @type {{ metadata: { title: string, date?: string, tags?: string[], excerpt?: string, theme?: string } }} */
  export let metadata;

  $: tags = metadata.tags || [];
  $: desc = metadata.excerpt || '';
  $: date = metadata.date || '';
</script>

<WritingLayout {title} {date} {tags} {desc}>
  <slot />
</WritingLayout>

<script context="module">
  /** @type {{ title: string, date?: string, tags?: string[], excerpt?: string, theme?: string }} */
</script>
