

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BlfpmRep.js","_app/immutable/chunks/BWzCyYQT.js","_app/immutable/chunks/f23f8hhM.js","_app/immutable/chunks/3iCcA5Uq.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
