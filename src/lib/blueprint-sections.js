/**
 * Split the Blueprint's raw markdown into its three register-regions.
 *
 * The source document (`$lib/blueprint.md`, copied from the workspace's
 * `harrsoft/blueprint.md`) has grown a reverse-chronological *working log*
 * between the title and `## Purpose`, plus a `## Changelog` table at the foot.
 * Both are provenance — worth keeping, and worth keeping off the reading page,
 * where they push the actual document far below the fold.
 *
 * This does the split at render time so the markdown source (and its
 * canonical-copy relationship) is left untouched. Deterministic: the markers
 * are the `## Purpose` and `## Changelog` headings, each unique.
 *
 * @param {string} src raw markdown of the Blueprint
 * @returns {{ title: string, log: string, body: string, changelog: string }}
 */
export function splitBlueprint(src) {
	const lines = src.replace(/\r/g, '').split('\n');
	const findHeading = (name) =>
		lines.findIndex((l) => new RegExp(`^##\\s+${name}\\s*$`).test(l.trim()));

	// Line 0 is the document title (`# Blueprint: Symbiotic Liberation`), which
	// the page header renders separately — start the log just after it.
	const purpose = findHeading('Purpose');
	const changelog = findHeading('Changelog');

	const title = (lines[0] || '').replace(/^#\s+/, '').trim();
	const logEnd = purpose >= 0 ? purpose : lines.length;
	const bodyEnd = changelog >= 0 ? changelog : lines.length;

	return {
		title,
		log: lines.slice(1, logEnd).join('\n').trim(),
		body: lines.slice(purpose >= 0 ? purpose : 0, bodyEnd).join('\n').trim(),
		changelog: changelog >= 0 ? lines.slice(changelog).join('\n').trim() : ''
	};
}
