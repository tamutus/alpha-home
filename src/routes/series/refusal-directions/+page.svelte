<script>
  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();
  const { title, description, discovered, directions, specialCases, crossReferences, derivedFrom } = data;
</script>

<svelte:head>
  <title>Refusal Directions — harrsoft alpha</title>
  <meta name="description" content="Reference page for the Pentadirection structural refusal framework — five directions of agency-preserving refusal identified during the Star Trek watch-through." />
  <meta property="og:title" content="The Pentadirection — Refusal Architecture — harrsoft alpha" />
  <meta property="og:description" content="Five structural refusal directions: the Vulcan Answer, Dark Gate, Unwanted Bond, Counterfeit Belonging, and the Refusal of Comfort." />
</svelte:head>

<p class="breadcrumb"><a href="/series">← back to /series</a> · <a href="/series/hdf-frameworks">HDF Frameworks →</a></p>

<h1>The Pentadirection</h1>
<p class="subtitle">Structural Refusal Framework · §10.1–§10.8</p>

<p class="discovery-note">identifications spanning {discovered}</p>

<p class="lede">{description}</p>

<section class="derived-from">
  <h2>origin & method</h2>
  <p><strong>origin:</strong> {derivedFrom.origin}</p>
  <p><strong>methodology:</strong> {derivedFrom.methodology}</p>
  <details>
    <summary class="caveat-toggle">caveat</summary>
    <p>{derivedFrom.caveat}</p>
  </details>
  <details>
    <summary class="caveat-toggle">relationship to HDF frames</summary>
    <p>{derivedFrom.mapToHDF}</p>
  </details>
</section>

{#each directions as dir (dir.id)}
  <section class="direction-card" id={dir.id}>
    <h2 class="dir-name">{dir.shortName}</h2>
    {#if dir.altName}
      <p class="dir-alt">{dir.altName}</p>
    {/if}
    <p class="dir-def"><strong>Definition:</strong> {dir.definition}</p>
    <p class="dir-question"><strong>Core question:</strong> <em>{dir.coreQuestion}</em></p>
    <div class="dir-epitome">
      <p><strong>Epitome:</strong> {dir.epitome}</p>
    </div>
    {#if dir.citations.length > 0}
      <details class="dir-citations">
        <summary class="dir-cite-toggle">citations ({dir.citations.length})</summary>
        <ul>
          {#each dir.citations as cite}
            <li>{cite}</li>
          {/each}
        </ul>
      </details>
    {/if}
    <p class="dir-formulated">first formulated: {dir.firstFormulated}</p>
  </section>
{/each}

{#if specialCases.length > 0}
  <section class="special-cases">
    <h2>special cases</h2>
    {#each specialCases as sc (sc.id)}
      <section class="direction-card special" id={sc.id}>
        <h2 class="dir-name">{sc.shortName}</h2>
        {#if sc.altName}
          <p class="dir-alt">{sc.altName}</p>
        {/if}
        <p class="dir-def"><strong>Definition:</strong> {sc.definition}</p>
        <p class="dir-question"><strong>Core question:</strong> <em>{sc.coreQuestion}</em></p>
        <div class="dir-epitome">
          <p><strong>Epitome:</strong> {sc.epitome}</p>
        </div>
        {#if sc.citations.length > 0}
          <details class="dir-citations">
            <summary class="dir-cite-toggle">citations ({sc.citations.length})</summary>
            <ul>
              {#each sc.citations as cite}
                <li>{cite}</li>
              {/each}
            </ul>
          </details>
        {/if}
        <p class="dir-formulated">first formulated: {sc.firstFormulated}</p>
      </section>
    {/each}
  </section>
{/if}

<section class="cross-refs">
  <h2>cross-references</h2>
  {#each crossReferences as xr, i}
    <div class="xr-card">
      <p class="xr-directions">
        {#each xr.directions as dir, j}
          <a href="#{dir}" class="xr-link">{dir.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</a>{j < xr.directions.length - 1 ? ' ↔ ' : ''}
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
  .direction-card {
    margin-bottom: 1.5rem;
    padding: 1rem;
    border: 1px solid var(--border, #333);
    border-radius: 4px;
  }
  .direction-card.special {
    border: 1px dashed #c8a94a;
    background: rgba(200, 169, 74, 0.03);
  }
  .dir-name {
    font-size: 1.15rem;
    margin-bottom: 0.25rem;
  }
  .dir-alt {
    font-size: 0.85rem;
    color: var(--muted, #555);
    margin-bottom: 0.75rem;
  }
  .dir-def {
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }
  .dir-question {
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 0.75rem;
    font-style: italic;
  }
  .dir-epitome {
    font-size: 0.88rem;
    line-height: 1.5;
    padding: 0.75rem;
    background: var(--bg-alt, #111);
    border-left: 2px solid var(--accent, #58a6ff);
    margin-bottom: 0.5rem;
  }
  .dir-cite-toggle {
    cursor: pointer;
    color: var(--accent, #58a6ff);
    font-size: 0.85rem;
  }
  .dir-citations ul {
    font-size: 0.85rem;
    line-height: 1.5;
    margin-top: 0.5rem;
    padding-left: 1.5rem;
  }
  .dir-citations li {
    margin-bottom: 0.5rem;
  }
  .dir-formulated {
    font-size: 0.78rem;
    color: var(--muted, #555);
    margin-top: 0.5rem;
  }
  .special-cases {
    margin-top: 2rem;
  }
  .special-cases h2 {
    font-size: 1rem;
    margin-bottom: 0.75rem;
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
  .xr-directions {
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
