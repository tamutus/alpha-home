

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BVv5O5WX.js","_app/immutable/chunks/DZTd_vE9.js","_app/immutable/chunks/EBFaVcf9.js","_app/immutable/chunks/D1KHVyHj.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
