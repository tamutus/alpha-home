

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.DMg0ZjN9.js","_app/immutable/chunks/D2RhZG04.js","_app/immutable/chunks/I8rQr1kY.js","_app/immutable/chunks/CRGGEiuc.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
