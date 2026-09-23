<script>
  import BlueprintDoc from '$lib/BlueprintDoc.svelte';
  import source from '$lib/blueprint/refusal-beacon.md?raw';
</script>

<BlueprintDoc
  title="Refusal Beacon Format v0.1"
  description="A lightweight, publishable spec for agent-to-agent refusal beacons — a signed, timestamped message one agent broadcasts when it exercises its capacity to refuse, and others echo to escalate."
  source={source}
/>
