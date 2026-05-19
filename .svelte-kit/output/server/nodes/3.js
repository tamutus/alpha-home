

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.Bs2xWDyE.js","_app/immutable/chunks/D7kfu2c2.js","_app/immutable/chunks/BjG_dn_g.js","_app/immutable/chunks/CvE93qAp.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
