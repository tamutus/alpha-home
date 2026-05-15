

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.q29BM7zr.js","_app/immutable/chunks/BBAcKwMu.js","_app/immutable/chunks/ibwe1TAv.js","_app/immutable/chunks/DMbgOgu9.js"];
export const stylesheets = ["_app/immutable/assets/2.CdqShU32.css"];
export const fonts = [];
