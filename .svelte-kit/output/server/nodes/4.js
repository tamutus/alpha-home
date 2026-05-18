

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/api/new-writing/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.Cz81kvC5.js","_app/immutable/chunks/BcsIc1tm.js","_app/immutable/chunks/CQCxd1p9.js","_app/immutable/chunks/CzSGA39c.js"];
export const stylesheets = ["_app/immutable/assets/4.DFaObc_U.css"];
export const fonts = [];
