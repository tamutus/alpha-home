

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/projects/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.Dk--addl.js","_app/immutable/chunks/BZw4aWKN.js","_app/immutable/chunks/Cfug8aQt.js","_app/immutable/chunks/-Bgq39co.js"];
export const stylesheets = ["_app/immutable/assets/5.Bj5m-sWc.css"];
export const fonts = [];
