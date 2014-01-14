module.exports = function (writeln) {

	var path = require('path');
	var tsd = require('tsd');
	var Q = require('q');
	var Lazy = require('lazy.js');
	var Strict = Lazy.strict();

	function getAPI(options) {
		writeln('-> config: ' + options.config);
		var api = tsd.getAPI(options.config, options.verbose);
		if (options.cacheDir) {
			writeln('cacheDir: ' + options.cacheDir);
			api.context.paths.cacheDir = path.resolve(options.cacheDir);
		}
		return api;
	}

	function getIndex(options) {
		var api = getAPI(options);

		return api.readConfig(options.config, (!!options.config)).then(function () {
			var opts = new tsd.Options();

			var query = new tsd.Query();
			//query.parseInfo = true;
			query.addNamePattern('*');

			return api.select(query, opts).progress(function(note) {
				writeln('-> note: ' + note);
			});
		}).then(function (selection) {
			return selection.definitions.sort(tsd.DefUtil.defCompare).map(function (def) {
				var ret = {
					project: def.project,
					name: def.name,
					path: def.path
				};
				if (def.semver) {
					ret.semver = def.semver;
				}
				if (def.head.info) {
					ret.info = def.head.info;
				}
				return ret;
			});
		}).then(function (content) {
			var ret = {
				repo: api.context.config.repo,
				ref: api.context.config.ref
			};
			ret.urls = {
				def: 'https://github.com/' + ret.repo + '/blob/' + ret.ref + '/{path}'
			};
			ret.content = content;
			return ret;
		});
	}

	var scope = {
		getIndex: getIndex
	};
	return scope;
};
