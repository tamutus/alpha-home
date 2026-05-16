

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.q5Q3y98L.js","_app/immutable/chunks/BWGvByKn.js","_app/immutable/chunks/CuyqONxg.js","_app/immutable/chunks/CBsl0vYm.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
