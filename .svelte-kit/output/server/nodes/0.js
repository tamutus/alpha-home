

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.Bq8MrMuO.js","_app/immutable/chunks/C2X922Qf.js","_app/immutable/chunks/v_jBEYI6.js","_app/immutable/chunks/mqR00Pw4.js"];
export const stylesheets = ["_app/immutable/assets/0.Ckyht5aj.css"];
export const fonts = [];
