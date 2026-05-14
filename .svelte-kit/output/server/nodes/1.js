

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CJ3q3SfN.js","_app/immutable/chunks/CNRvwAF6.js","_app/immutable/chunks/DOwJzloN.js","_app/immutable/chunks/D9FQP20W.js"];
export const stylesheets = [];
export const fonts = [];
