

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DmKXQjQ0.js","_app/immutable/chunks/BWGvByKn.js","_app/immutable/chunks/CuyqONxg.js","_app/immutable/chunks/CBsl0vYm.js"];
export const stylesheets = ["_app/immutable/assets/2.CdqShU32.css"];
export const fonts = [];
