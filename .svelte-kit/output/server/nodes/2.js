

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.NM3qOzIH.js","_app/immutable/chunks/BcsIc1tm.js","_app/immutable/chunks/CQCxd1p9.js","_app/immutable/chunks/CzSGA39c.js"];
export const stylesheets = ["_app/immutable/assets/2.DEEAUbwL.css"];
export const fonts = [];
