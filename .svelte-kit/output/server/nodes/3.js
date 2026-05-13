

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.Ceq52F0i.js","_app/immutable/chunks/BlryM097.js","_app/immutable/chunks/v_jBEYI6.js","_app/immutable/chunks/cbSl6ZVI.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
