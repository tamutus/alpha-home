

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.DbcyFdM1.js","_app/immutable/chunks/BtHgFV7z.js","_app/immutable/chunks/Dr15X4ZF.js","_app/immutable/chunks/Bl3EElJS.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
