

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.BK7zrKCN.js","_app/immutable/chunks/CZZIG4ng.js","_app/immutable/chunks/S-KyrcF8.js","_app/immutable/chunks/rRqV1c8k.js"];
export const stylesheets = ["_app/immutable/assets/2.CdqShU32.css"];
export const fonts = [];
