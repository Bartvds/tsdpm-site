module.exports = function(grunt) {

	var util = require('util');

	grunt.registerMultiTask('build_data', function(){
		var options = this.options({
			config: './conf/tsd.json'
		});
		var done = this.async();
		// lazy init
		var updater = require('../src/updater.js')(grunt.log.writeln);

		updater.getIndex(options).then(function(index) {
			grunt.file.write('./public/data/repository.json', JSON.stringify(index, null, 2));
			grunt.log.writeln(util.inspect(index, null, 4));
			done();
		}).fail(function(err) {
			grunt.log.writeln(err.message);
			grunt.log.writeln(err.stack);
			done(false);
		});
	});
};