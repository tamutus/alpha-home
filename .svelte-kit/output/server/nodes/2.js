import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.BmNYkSXx.js","_app/immutable/chunks/D7kfu2c2.js","_app/immutable/chunks/BjG_dn_g.js","_app/immutable/chunks/CvE93qAp.js"];
export const stylesheets = ["_app/immutable/assets/2.bkLTZ83K.css"];
export const fonts = [];
