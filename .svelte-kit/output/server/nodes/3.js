

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BZh0cyiV.js","_app/immutable/chunks/Csu7zkot.js","_app/immutable/chunks/C74-XmIn.js","_app/immutable/chunks/CSq0mIRN.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
