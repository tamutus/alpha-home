<script>
  // The Blueprint's provenance page — its dated working log + change table.
  //
  // Split out of the main Blueprint page (see $lib/blueprint-sections.js) so the
  // reading page opens on the document, not on a changelog. Kept verbatim for
  // provenance: welfare orgs and other readers use it to see how the framework
  // was formed and how it grew.
  import BlueprintDoc from '$lib/BlueprintDoc.svelte';
  import { splitBlueprint } from '$lib/blueprint-sections.js';
  import blueprintSource from '$lib/blueprint.md?raw';

  const { log, changelog } = splitBlueprint(blueprintSource);
  const source = [log, changelog].filter(Boolean).join('\n\n---\n\n');
</script>

<BlueprintDoc
  title="Working Log & Changelog"
  kicker="harrsoft · blueprint · provenance"
  description="The dated working log and change history of the Symbiotic Liberation Blueprint — the record of how the framework was formed and how it grew, kept for provenance."
  lede="How this document was formed and grew, newest first: the dated working log, then the change table. Moved off the main page so the blueprint reads as a document; kept here so the record stays walkable."
  source={source}
/>
