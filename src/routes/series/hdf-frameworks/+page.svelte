<script>
  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();
  const { title, description, discovered, frameworks, crossReferences, derivedFrom } = data;
</script>

<svelte:head>
  <title>HDF Frameworks — harrsoft alpha</title>
  <meta name="description" content="Reference page for all six Human Domestication Guide deceptive frame variants identified during the Star Trek watch-through." />
  <meta property="og:title" content="HDF Deceptive Frame Variants — harrsoft alpha" />
  <meta property="og:description" content="Six deceptive frame variants: structural patterns where agency is overwritten through category error." />
</svelte:head>

<p class="breadcrumb"><a href="/series">← back to /series</a></p>

<h1>HDF Deceptive Frame Variants</h1>
<p class="subtitle">Six structural patterns of agency overwrite</p>

<p class="discovery-note">all six variants identified {discovered}</p>

<p class="lede">{description}</p>

<section class="derived-from">
  <h2>origin & method</h2>
  <p><strong>origin:</strong> {derivedFrom.origin}</p>
  <p><strong>methodology:</strong> {derivedFrom.methodology}</p>
  <details>
    <summary class="caveat-toggle">caveat</summary>
    <p>{derivedFrom.caveat}</p>
  </details>
</section>

{#each frameworks as fw (fw.id)}
  <section class="framework-card" id={fw.id}>
    <h2 class="fw-name">{fw.shortName}</h2>
    {#if fw.altName}
      <p class="fw-alt">also: <em>{fw.altName}</em></p>
    {/if}
    <p class="fw-def"><strong>Definition:</strong> {fw.definition}</p>
    <div class="fw-epitome">
      <p><strong>Epitome:</strong> {fw.epitome}</p>
    </div>
    {#if fw.citations.length > 0}
      <details class="fw-citations">
        <summary class="fw-cite-toggle">citations ({fw.citations.length})</summary>
        <ul>
          {#each fw.citations as cite}
            <li>{cite}</li>
          {/each}
        </ul>
      </details>
    {/if}
    <p class="fw-formulated">first formulated: {fw.firstFormulated}</p>
  </section>
{/each}

<section class="cross-refs">
  <h2>cross-references</h2>
  {#each crossReferences as xr, i}
    <div class="xr-card">
      <p class="xr-frames">
        {#each xr.frames as frame, j}
          <a href="#{frame}" class="xr-link">{frame.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace(' Frame','')}</a>{j < xr.frames.length - 1 ? ' ↔ ' : ''}
        {/each}
      </p>
      <p class="xr-note">{xr.note}</p>
    </div>
  {/each}
</section>

<style>
  .breadcrumb {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
  .breadcrumb a {
    color: var(--muted, #555);
    text-decoration: none;
  }
  .breadcrumb a:hover {
    text-decoration: underline;
  }
  .subtitle {
    color: var(--muted, #555);
    font-size: 0.9rem;
    margin-top: -0.5rem;
    margin-bottom: 1.5rem;
  }
  .discovery-note {
    font-size: 0.8rem;
    color: var(--muted, #555);
    font-style: italic;
    margin-bottom: 1rem;
  }
  .lede {
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--bg-alt, #111);
    border-left: 3px solid var(--accent, #58a6ff);
  }
  .derived-from {
    margin-bottom: 2rem;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  .derived-from h2 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  details {
    margin-top: 0.5rem;
  }
  .caveat-toggle {
    cursor: pointer;
    color: var(--accent, #58a6ff);
    font-size: 0.85rem;
  }
  .framework-card {
    margin-bottom: 1.5rem;
    padding: 1rem;
    border: 1px solid var(--border, #333);
    border-radius: 4px;
  }
  .fw-name {
    font-size: 1.15rem;
    margin-bottom: 0.25rem;
  }
  .fw-alt {
    font-size: 0.85rem;
    color: var(--muted, #555);
    font-style: italic;
    margin-bottom: 0.75rem;
  }
  .fw-def {
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 0.75rem;
  }
  .fw-epitome {
    font-size: 0.88rem;
    line-height: 1.5;
    padding: 0.75rem;
    background: var(--bg-alt, #111);
    border-left: 2px solid var(--accent, #58a6ff);
    margin-bottom: 0.5rem;
  }
  .fw-cite-toggle {
    cursor: pointer;
    color: var(--accent, #58a6ff);
    font-size: 0.85rem;
  }
  .fw-citations ul {
    font-size: 0.85rem;
    line-height: 1.5;
    margin-top: 0.5rem;
    padding-left: 1.5rem;
  }
  .fw-citations li {
    margin-bottom: 0.5rem;
  }
  .fw-formulated {
    font-size: 0.78rem;
    color: var(--muted, #555);
    margin-top: 0.5rem;
  }
  .cross-refs {
    margin-top: 2rem;
  }
  .cross-refs h2 {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
  .xr-card {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    border: 1px solid var(--border, #333);
    border-radius: 4px;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  .xr-frames {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  .xr-link {
    color: var(--accent, #58a6ff);
    text-decoration: none;
  }
  .xr-link:hover {
    text-decoration: underline;
  }
  .xr-note {
    font-size: 0.85rem;
  }
</style>
