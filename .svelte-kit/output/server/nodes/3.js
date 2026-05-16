

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.84oU9UOA.js","_app/immutable/chunks/-y1inFhC.js","_app/immutable/chunks/3bfzTCuz.js","_app/immutable/chunks/ChUFyl7Y.js"];
export const stylesheets = ["_app/immutable/assets/3.Cjax3zbj.css"];
export const fonts = [];
