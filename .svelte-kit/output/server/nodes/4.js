

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/api/new-writing/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.CaIkGtQn.js","_app/immutable/chunks/DxVCDM5w.js","_app/immutable/chunks/CcbT4W3N.js","_app/immutable/chunks/CQO7pFqI.js"];
export const stylesheets = ["_app/immutable/assets/4.DFaObc_U.css"];
export const fonts = [];
