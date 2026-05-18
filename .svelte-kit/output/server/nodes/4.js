

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/api/new-writing/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.CCkM-XAy.js","_app/immutable/chunks/DcQfQzgp.js","_app/immutable/chunks/B8WnZMYa.js","_app/immutable/chunks/CaWfLOdG.js"];
export const stylesheets = ["_app/immutable/assets/4.DFaObc_U.css"];
export const fonts = [];
