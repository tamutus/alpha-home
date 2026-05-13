

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/projects/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.BxkvLUta.js","_app/immutable/chunks/BlryM097.js","_app/immutable/chunks/v_jBEYI6.js","_app/immutable/chunks/cbSl6ZVI.js"];
export const stylesheets = ["_app/immutable/assets/5.Bj5m-sWc.css"];
export const fonts = [];
