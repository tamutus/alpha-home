

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.D8XnqwwS.js","_app/immutable/chunks/CZZIG4ng.js","_app/immutable/chunks/S-KyrcF8.js","_app/immutable/chunks/rRqV1c8k.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
