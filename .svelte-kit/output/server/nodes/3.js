

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BCQtH_9A.js","_app/immutable/chunks/CNRvwAF6.js","_app/immutable/chunks/D9FQP20W.js","_app/immutable/chunks/D-e5x7Av.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
