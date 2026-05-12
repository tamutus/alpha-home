

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.BqIpWKA-.js","_app/immutable/chunks/BZw4aWKN.js","_app/immutable/chunks/Cfug8aQt.js","_app/immutable/chunks/-Bgq39co.js"];
export const stylesheets = ["_app/immutable/assets/2.hhG3GHBP.css"];
export const fonts = [];
