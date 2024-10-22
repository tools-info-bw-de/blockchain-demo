

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.DmzxcIh5.js","_app/immutable/chunks/scheduler._-uiodl9.js","_app/immutable/chunks/index.CRbmlngd.js","_app/immutable/chunks/entry.CE0pWwQ7.js"];
export const stylesheets = [];
export const fonts = [];
