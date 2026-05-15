

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BnQyvMN2.js","_app/immutable/chunks/CqrA75_a.js","_app/immutable/chunks/DEggy0fl.js","_app/immutable/chunks/C2zy4JDl.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
