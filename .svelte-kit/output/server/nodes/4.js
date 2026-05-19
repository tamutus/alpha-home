

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/api/new-writing/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.oVyZZqtf.js","_app/immutable/chunks/BtHgFV7z.js","_app/immutable/chunks/Dr15X4ZF.js","_app/immutable/chunks/Bl3EElJS.js"];
export const stylesheets = ["_app/immutable/assets/4.DFaObc_U.css"];
export const fonts = [];
