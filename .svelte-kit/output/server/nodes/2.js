

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.Dt9MKEBo.js","_app/immutable/chunks/CqrA75_a.js","_app/immutable/chunks/DEggy0fl.js","_app/immutable/chunks/C2zy4JDl.js"];
export const stylesheets = ["_app/immutable/assets/2.CdqShU32.css"];
export const fonts = [];
