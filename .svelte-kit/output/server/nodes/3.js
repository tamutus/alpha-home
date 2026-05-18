

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.C_FLRKO6.js","_app/immutable/chunks/BdZM5nlP.js","_app/immutable/chunks/Cs5QDfgy.js","_app/immutable/chunks/AjbdthtF.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
