

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/now/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.VtgjVrOb.js","_app/immutable/chunks/CqrA75_a.js","_app/immutable/chunks/DEggy0fl.js","_app/immutable/chunks/C2zy4JDl.js"];
export const stylesheets = ["_app/immutable/assets/5.Ca-zanND.css"];
export const fonts = [];
