

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/now/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.D0CLYaz1.js","_app/immutable/chunks/D2RhZG04.js","_app/immutable/chunks/I8rQr1kY.js","_app/immutable/chunks/CRGGEiuc.js"];
export const stylesheets = ["_app/immutable/assets/5.Ca-zanND.css"];
export const fonts = [];
