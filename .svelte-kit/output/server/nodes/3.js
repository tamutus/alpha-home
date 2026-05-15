

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BgQMuNQs.js","_app/immutable/chunks/BBAcKwMu.js","_app/immutable/chunks/ibwe1TAv.js","_app/immutable/chunks/DMbgOgu9.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
