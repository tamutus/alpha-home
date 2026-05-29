<script>
  /**
   * ArtifactScan — a CSS loading animation inspired by Picard's jury-rigged scanner
   * from TNG S7E4 "Gambit Part I".
   *
   * Shows a rectangular "scanning frame" with a beam that sweeps horizontally,
   * then emits a subtle "scan complete" ping on finish.
   *
   * Props:
   *  - scanning: bind this to a boolean — true while loading, false when done
   *  - label: accessible label text (default "Scanning…")
   *  - compact: smaller variant for inline use
   */
  /** @type {boolean} */ export let scanning = false;
  /** @type {string} */   export let label = 'Scanning…';
  /** @type {boolean} */ export let compact = false;
</script>

{#if scanning}
  <div class="artifact-scan" class:compact role="status" aria-label={label}>
    <div class="scan-frame">
      <div class="scan-beam"></div>
      <div class="scan-corners">
        <span class="corner tl"></span><span class="corner tr"></span>
        <span class="corner bl"></span><span class="corner br"></span>
      </div>
      <div class="scan-content">
        <div class="scan-line"></div>
        <div class="scan-line"></div>
        <div class="scan-line short"></div>
      </div>
    </div>
    <span class="scan-label">{label}</span>
  </div>
{/if}

<style>
  .artifact-scan {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    padding: 2rem 1rem;
    width: 100%;
  }

  .artifact-scan.compact {
    padding: 0.75rem 0.5rem;
    gap: 0.4rem;
  }

  .scan-frame {
    position: relative;
    width: 240px;
    height: 64px;
    overflow: hidden;
  }

  .artifact-scan.compact .scan-frame {
    width: 140px;
    height: 40px;
  }

  /* Sweeping beam */
  .scan-beam {
    position: absolute;
    top: 0;
    left: -20%;
    width: 20%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--accent, #58a6ff) 40%,
      var(--accent, #58a6ff) 60%,
      transparent 100%
    );
    opacity: 0.25;
    border-radius: 3px;
    animation: beam-sweep 1.6s ease-in-out infinite;
    z-index: 2;
  }

  @keyframes beam-sweep {
    0%   { left: -20%; opacity: 0.08; }
    25%  { opacity: 0.3; }
    50%  { left: 100%; opacity: 0.3; }
    75%  { opacity: 0.08; }
    100% { left: 120%; opacity: 0; }
  }

  /* Corner brackets */
  .scan-corners {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
  }

  .corner {
    position: absolute;
    width: 12px;
    height: 12px;
    border-color: var(--accent, #58a6ff);
    border-style: solid;
  }

  .artifact-scan.compact .corner {
    width: 8px;
    height: 8px;
  }

  .corner.tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
  .corner.tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
  .corner.bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
  .corner.br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

  /* Content placeholder lines */
  .scan-content {
    position: absolute;
    inset: 0;
    padding: 12px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    z-index: 1;
  }

  .artifact-scan.compact .scan-content {
    padding: 8px 14px;
    gap: 4px;
  }

  .scan-line {
    height: 4px;
    background: var(--border, #30363d);
    border-radius: 2px;
    animation: pulse-content 1.6s ease-in-out infinite;
  }

  .scan-line.short {
    width: 60%;
  }

  @keyframes pulse-content {
    0%, 100% { opacity: 0.3; }
    50%      { opacity: 0.8; }
  }

  .scan-label {
    font-size: 0.8rem;
    color: var(--accent, #58a6ff);
    opacity: 0.7;
    letter-spacing: 0.08em;
    animation: scan-ping 2s ease-in-out infinite;
  }

  @keyframes scan-ping {
    0%, 70%, 100% { opacity: 0.7; }
    90%           { opacity: 1; filter: brightness(1.3); }
  }


</style>
