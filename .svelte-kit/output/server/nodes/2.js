import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.DXfwSjz4.js","_app/immutable/chunks/scheduler._-uiodl9.js","_app/immutable/chunks/index.CRbmlngd.js"];
export const stylesheets = ["_app/immutable/assets/2.DskfMrnN.css"];
export const fonts = [];
