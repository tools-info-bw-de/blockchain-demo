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
		client: {"start":"_app/immutable/entry/start.DfHo1EGY.js","app":"_app/immutable/entry/app.ezB6APFZ.js","imports":["_app/immutable/entry/start.DfHo1EGY.js","_app/immutable/chunks/entry.fn1db9W8.js","_app/immutable/chunks/scheduler._-uiodl9.js","_app/immutable/entry/app.ezB6APFZ.js","_app/immutable/chunks/scheduler._-uiodl9.js","_app/immutable/chunks/index.CRbmlngd.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
