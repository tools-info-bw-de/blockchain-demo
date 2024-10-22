export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.BcBsEGmo.js","app":"_app/immutable/entry/app.Boa98EhG.js","imports":["_app/immutable/entry/start.BcBsEGmo.js","_app/immutable/chunks/entry.CE0pWwQ7.js","_app/immutable/chunks/scheduler._-uiodl9.js","_app/immutable/entry/app.Boa98EhG.js","_app/immutable/chunks/scheduler._-uiodl9.js","_app/immutable/chunks/index.CRbmlngd.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
