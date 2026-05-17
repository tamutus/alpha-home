

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DU3hCH-a.js","_app/immutable/chunks/Csu7zkot.js","_app/immutable/chunks/C74-XmIn.js","_app/immutable/chunks/CSq0mIRN.js"];
export const stylesheets = ["_app/immutable/assets/2.CdqShU32.css"];
export const fonts = [];
