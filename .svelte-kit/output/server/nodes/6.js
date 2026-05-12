

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/writing/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.BqitYTVg.js","_app/immutable/chunks/BZw4aWKN.js","_app/immutable/chunks/Cfug8aQt.js","_app/immutable/chunks/-Bgq39co.js"];
export const stylesheets = ["_app/immutable/assets/6.DXcWuIW6.css"];
export const fonts = [];
