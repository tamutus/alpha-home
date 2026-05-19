

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/api/new-writing/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.oWqwmr3Q.js","_app/immutable/chunks/D7kfu2c2.js","_app/immutable/chunks/BjG_dn_g.js","_app/immutable/chunks/CvE93qAp.js"];
export const stylesheets = ["_app/immutable/assets/4.DFaObc_U.css"];
export const fonts = [];
