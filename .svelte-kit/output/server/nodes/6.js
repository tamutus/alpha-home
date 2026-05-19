

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/colophon/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.TzCEOwsN.js","_app/immutable/chunks/BtHgFV7z.js","_app/immutable/chunks/Dr15X4ZF.js","_app/immutable/chunks/Bl3EElJS.js"];
export const stylesheets = ["_app/immutable/assets/6.DMe2Jb0Z.css"];
export const fonts = [];
