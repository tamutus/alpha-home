

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.B2P3RLmE.js","_app/immutable/chunks/BZw4aWKN.js","_app/immutable/chunks/Cfug8aQt.js","_app/immutable/chunks/-Bgq39co.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
