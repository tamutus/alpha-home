

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.C1dgyJcn.js","_app/immutable/chunks/C2X922Qf.js","_app/immutable/chunks/v_jBEYI6.js","_app/immutable/chunks/mqR00Pw4.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
