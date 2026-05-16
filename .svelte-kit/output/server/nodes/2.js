

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DhnQJjLd.js","_app/immutable/chunks/6qFb45Oe.js","_app/immutable/chunks/BFbU5qhn.js","_app/immutable/chunks/CLr1iwbg.js"];
export const stylesheets = ["_app/immutable/assets/2.CdqShU32.css"];
export const fonts = [];
