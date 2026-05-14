

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.C10zPxBS.js","_app/immutable/chunks/CNRvwAF6.js","_app/immutable/chunks/D9FQP20W.js","_app/immutable/chunks/D-e5x7Av.js"];
export const stylesheets = ["_app/immutable/assets/2.CdqShU32.css"];
export const fonts = [];
