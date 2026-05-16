

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/now/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.D6Z8dtkM.js","_app/immutable/chunks/Du3BlPRE.js","_app/immutable/chunks/2TU3FloQ.js","_app/immutable/chunks/ChCJ3R3H.js"];
export const stylesheets = ["_app/immutable/assets/5.Ca-zanND.css"];
export const fonts = [];
