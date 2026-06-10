/**
 * Svelte use:action — adds hover-reveal anchor links to h2/h3 elements.
 *
 * Usage: <div class="prose" use:headingAnchors>
 *
 * Each heading without an id gets a slugified id from its text content,
 * and a clickable § link that appears on hover via CSS.
 */
export function headingAnchors(node) {
  const headings = node.querySelectorAll('h2, h3');

  for (const el of headings) {
    if (el.id) continue;

    const text = el.textContent || '';
    const id = slugify(text);
    el.id = id;

    const anchor = document.createElement('a');
    anchor.href = `#${id}`;
    anchor.className = 'heading-anchor';
    anchor.textContent = '§';
    anchor.setAttribute('aria-label', `Section: ${text}`);
    anchor.setAttribute('tabindex', '-1');

    el.classList.add('has-anchor');
    el.prepend(anchor);
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
