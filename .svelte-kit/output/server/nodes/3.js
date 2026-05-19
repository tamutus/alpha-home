

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.DyfGMsA0.js","_app/immutable/chunks/DxVCDM5w.js","_app/immutable/chunks/CcbT4W3N.js","_app/immutable/chunks/CQO7pFqI.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
