

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BGVQ2Xly.js","_app/immutable/chunks/DxVCDM5w.js","_app/immutable/chunks/CcbT4W3N.js","_app/immutable/chunks/CQO7pFqI.js"];
export const stylesheets = ["_app/immutable/assets/0.CAngMDyv.css"];
export const fonts = [];
