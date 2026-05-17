

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.DWnowGgZ.js","_app/immutable/chunks/BZoF_3qg.js","_app/immutable/chunks/ZsEnWiqm.js","_app/immutable/chunks/DGPJEk96.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
