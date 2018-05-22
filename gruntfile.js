/*global module*/
module.exports = function(grunt) {
	"use strict";

	grunt.config("pkg", grunt.file.readJSON("package.json"));
	// grunt.config("properties.ga", grunt.file.readJSON("ga.json"));
	grunt.config("properties.CNAME", grunt.file.read("CNAME", { encoding: 'utf8' }));


	grunt.config("paths", {
		"srcAssets": "workspace/assets",
		"destAssets": "workspace/assets",
		"srcRoot": "http://localhost/projects/folio-sym",
		"destRoot": "./",
	});

	// grunt.loadNpmTasks('grunt-git');
	// grunt.config("gitcommit")

	grunt.loadNpmTasks("grunt-http");
	/*grunt.config("http", {
		options: {
			ignoreErrors: true
		},
		index: {
			options: { url: "<%= paths.srcRoot %>/" },
			dest: "index.html"
		},
		data: {
			options: { url: "<%= paths.srcRoot %>/json" },
			dest: "<%= paths.destAssets %>/js/data.js"
		},
		"styles-ie": {
			options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/css/folio-ie.css" },
			dest: "<%= paths.destAssets %>/css/folio-ie.css"
		},
		"styles": {
			options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/css/folio-debug.css" },
			dest: "<%= paths.destAssets %>/css/folio-debug.css"
		},
		"fonts": {
			options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/css/fonts.css" },
			dest: "<%= paths.destAssets %>/css/fonts.css"
		},
		"scripts-vendor": {
			options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/js/folio-debug-vendor.js" },
			dest: "<%= paths.destAssets %>/js/folio-debug-vendor.js"
		},
		"scripts-client": {
			options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/js/folio-debug-client.js" },
			dest: "<%= paths.destAssets %>/js/folio-debug-client.js"
		},
	});*/
	grunt.config("http", [
		"css/fonts.css",
		"css/folio-debug.css",
		"css/folio-ie.css",
		"js/folio-debug-client.js",
		"js/folio-debug-vendor.js",
		"css/folio-debug.css.map",
		"css/folio-ie.css.map",
		"js/folio-debug-client.js.map",
		"js/folio-debug-vendor.js.map",
	].reduce(function(o, s, i, a) {
		o[s.replace(/[\/\.]/g, "-")] = {
			options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/" + s },
			dest: "<%= paths.destAssets %>/" + s
		}
		return o;
	}, {
		options: {
			ignoreErrors: true
		},
		index: {
			options: { url: "<%= paths.srcRoot %>/" },
			dest: "index.html"
		},
		data: {
			options: { url: "<%= paths.srcRoot %>/json" },
			dest: "<%= paths.destAssets %>/js/data.js"
		}
	}));

	function toPattern(s) {
		s = grunt.template.process(s, grunt.config());
		s = s.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		return new RegExp(s, "g");
	}
	grunt.loadNpmTasks("grunt-string-replace");
	grunt.config("string-replace", {
		"http-root": {
			files: {
				"./": [
					"index.html",
					"<%= paths.destAssets %>/css/*",
					"<%= paths.destAssets %>/js/*"
				]
			},
			options: {
				replacements: [
					// { pattern: "<%= paths.srcAssets %>", replacement: "<%= paths.destAssets %>"},
					// { pattern: /https?:\/\/[^\/\"\']+/g}, replacement: "./" },
					// { pattern: /https?:\/\/folio\.(local\.|localhost)/g}, replacement: "./" },
					{ pattern: toPattern("<%= paths.srcRoot %>/"), replacement: "<%= paths.destRoot %>" },
				]
			}
		}
	});

	grunt.registerTask("build", ["http", "string-replace:http-root"]);
	grunt.registerTask("default", ["build"]);
};