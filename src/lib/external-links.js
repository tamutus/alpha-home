/**
 * Svelte action: use:externalLinks
 *
 * Automatically adds target="_blank" and rel="noopener noreferrer" to all
 * external anchor links (href^="http" and not matching this site's origin).
 *
 * Use in any container element whose child links should be sanitized:
 *   <div use:externalLinks>
 *
 * Handles dynamic content via MutationObserver — works with SPA navigation.
 */
const SITE_ORIGIN = 'https://alpha-home-phi.vercel.app';

/**
 * @param {HTMLElement} node
 */
export function externalLinks(node) {
  function process() {
    const links = node.querySelectorAll('a[href^="http"]');
    for (const link of links) {
      try {
        const url = new URL(link.href);
        if (url.origin === SITE_ORIGIN) continue;
        if (link.getAttribute('target') === '_blank') continue; // already set
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      } catch {
        // malformed URL, skip
      }
    }
  }

  // Initial pass
  process();

  // Watch for dynamically added content (SPA navigation)
  const observer = new MutationObserver(process);
  observer.observe(node, { childList: true, subtree: true });

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
