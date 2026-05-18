

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.9JYpCiyh.js","_app/immutable/chunks/ssFPT0QL.js","_app/immutable/chunks/B8WnZMYa.js","_app/immutable/chunks/Jefan5AT.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
