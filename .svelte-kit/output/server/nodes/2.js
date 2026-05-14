

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DRrwaYEc.js","_app/immutable/chunks/D2RhZG04.js","_app/immutable/chunks/I8rQr1kY.js","_app/immutable/chunks/CRGGEiuc.js"];
export const stylesheets = ["_app/immutable/assets/2.CdqShU32.css"];
export const fonts = [];
