

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/api/new-writing/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.DGKiF-Kp.js","_app/immutable/chunks/BdZM5nlP.js","_app/immutable/chunks/Cs5QDfgy.js","_app/immutable/chunks/AjbdthtF.js"];
export const stylesheets = ["_app/immutable/assets/4.DFaObc_U.css"];
export const fonts = [];
