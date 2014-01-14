/*
 * grunt-tsd
 * https://github.com/DefinitelyTyped/grunt-tsd
 *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	var gtx = require('gruntfile-gtx').wrap(grunt);
	gtx.loadAuto();

	gtx.config({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: gtx.readJSON('.jshintrc', {
				reporter: './node_modules/jshint-path-reporter'
			}),
			all: ['Gruntfile.js', 'tasks/**/*.js', 'test/*.js', 'app/**/*.js', 'lib/**/*.js']
		},
		clean: {
			tmp: ['tmp/**/*', 'test/tmp/**/*'],
			dump: ['test/**/dump']
		},
		less: {
			build: {
				options: {},
				files: {
					'public/css/build.css': [
						'assets/css/build.less'
					]
				}
			}
		}
	});

	gtx.alias('components', [
		{	src: 'bower_components/bootstrap/dist/js//bootstrap.min.js',
			dest: 'public/js/bootstrap.js'
		},
		{	src: '*.*',
			expand: true,
			cwd: 'bower_components/bootstrap/dist/fonts',
			dest: 'public/fonts/'
		}
	].map(function (opts) {
		return gtx.configFor('copy', opts);
	}));

	gtx.config({
		build_data: {
			deploy: {
				options: {
					config: './conf/tsd-json'
				}
			}
		}
	});

	gtx.alias('prep', [
		'clean',
		'jshint'
	]);
	gtx.alias('build', [
		'prep',
		'components',
		'less:build'
	]);
	gtx.alias('test', ['build']);
	gtx.alias('default', ['test']);

	gtx.alias('dev', ['build_data:deploy']);

	gtx.finalise();
};
