

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.B8QBup4f.js","_app/immutable/chunks/BcsIc1tm.js","_app/immutable/chunks/CQCxd1p9.js","_app/immutable/chunks/CzSGA39c.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
