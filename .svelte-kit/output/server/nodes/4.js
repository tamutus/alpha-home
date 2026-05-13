

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/now/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.CJgOmqBU.js","_app/immutable/chunks/C2X922Qf.js","_app/immutable/chunks/v_jBEYI6.js","_app/immutable/chunks/mqR00Pw4.js"];
export const stylesheets = ["_app/immutable/assets/4.Ca-zanND.css"];
export const fonts = [];
