import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.VA_1Acd5.js","_app/immutable/chunks/BtHgFV7z.js","_app/immutable/chunks/Dr15X4ZF.js","_app/immutable/chunks/Bl3EElJS.js"];
export const stylesheets = ["_app/immutable/assets/2.bkLTZ83K.css"];
export const fonts = [];
