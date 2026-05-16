

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.uo3bbvDH.js","_app/immutable/chunks/BJjncnw6.js","_app/immutable/chunks/AZeLEXKw.js","_app/immutable/chunks/D-Xj-miD.js"];
export const stylesheets = ["_app/immutable/assets/2.CdqShU32.css"];
export const fonts = [];
