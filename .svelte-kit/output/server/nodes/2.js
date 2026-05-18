

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.F83FsH_s.js","_app/immutable/chunks/DcQfQzgp.js","_app/immutable/chunks/B8WnZMYa.js","_app/immutable/chunks/CaWfLOdG.js"];
export const stylesheets = ["_app/immutable/assets/2.DEEAUbwL.css"];
export const fonts = [];
