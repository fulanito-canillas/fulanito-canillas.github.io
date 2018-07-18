/*global module*/
module.exports = function(grunt) {
	"use strict";

	grunt.config("pkg", grunt.file.readJSON("package.json"));
	grunt.config("properties", grunt.file.readJSON("properties.json"));
	grunt.config("CNAME", grunt.file.read("CNAME", { encoding: 'utf8' }));

	grunt.config("paths", {
		"destAssets": "workspace/assets",
		"srcAssets": "workspace/assets",
		"destRoot": "",
		"srcRoot": "http://localhost/projects/folio-sym",
		"fontFiles": "{eot,otf,svg,ttf,woff,woff2}",
		"mediaFiles": "{ico,gif,jpg,jpeg,mp4,png,svg,webp,webm}",
	});

	/* --------------------------------
	/* clean:resources
	/* -------------------------------- */

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.config("clean", {
		resources: {
			src: [
				"workspace/assets/fonts",
				"workspace/assets/images"
			]
		},
		uploads: {
			src: [
				"workspace/uploads"
			]
		},
	});

	/* --------------------------------
	 * copy:resources
	 * -------------------------------- */

	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.config("copy", {
		resources: {
			files: [{
				expand: true,
				dest: "workspace/assets/",
				cwd: "node_modules/@folio/workspace-assets/",
				src: [
					"fonts/**/*.<%= paths.fontFiles %>",
					"images/**/*.<%= paths.mediaFiles %>",
				]
			}]
		},
		uploads: {
			files: [{
				expand: true,
				dest: "workspace/uploads/",
				cwd: "node_modules/@folio/workspace-uploads/",
				src: "*.<%= paths.mediaFiles %>"
			}]
		},
	});

	// grunt.config("copy", {
	// 	sources: {
	// 		options: {
	// 			process: function(content, srcpath) {
	// 				return content.replace(/(\s)url\((['"]).*?(?=[^\/]*['"])/g, "$1font-url($2");
	// 			}
	// 		},
	// 		files: [{
	// 			expand: true,
	// 			dest: "./build/generated/sass/fonts",
	// 			cwd: "./node_modules/@folio/workspace-assets/css/",
	// 			src: [
	// 				"_folio-figures.scss",
	// 				"_franklin-gothic-itc-cp.scss",
	// 			]
	// 		}]
	// 	}
	// });

	/* --------------------------------
	 * grunt-http
	 * -------------------------------- */

	grunt.loadNpmTasks("grunt-http");
	grunt.config("http", [
		// "css/fonts-debug.css",
		// "css/fonts-debug.css.map",
		"css/folio-debug.css",
		"css/folio-debug.css.map",
		"css/folio-ie.css",
		"css/folio-ie.css.map",
		"js/folio-debug-client.js",
		"js/folio-debug-client.js.map",
		"js/folio-debug-vendor.js",
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
			options: { url: "<%= paths.srcRoot %>/?force-debug" },
			dest: "index.html"
		},
		// index_dev: {
		// 	options: { url: "<%= paths.srcRoot %>/?force-debug" },
		// 	dest: "index.dev.html"
		// },
		// index_dist: {
		// 	options: { url: "<%= paths.srcRoot %>/?force-nodebug" },
		// 	dest: "index.dist.html"
		// },
		data: {
			options: { url: "<%= paths.srcRoot %>/json" },
			dest: "<%= paths.destAssets %>/js/data.js"
		}
	}));

	/* --------------------------------
	 * copy/process
	 * -------------------------------- */

	function toPattern(s) {
		s = grunt.template.process(s, grunt.config());
		s = s.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		s += "\\/?";
		grunt.log.writeln(s);
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
					{
						pattern: toPattern("<%= paths.srcRoot %>"),
						replacement: "<%= paths.destRoot %>"
					},
					{
						pattern: "UA-0000000-0",
						replacement: "<%= properties.ga.id %>"
					},
				]
			}
		}
	});

	/* --------------------------------
	 * minify html
	 * -------------------------------- */
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.config("htmlmin", {
		main: {
			options: {
				minifyCSS: true,
				minifyJS: true,
				removeComments: true,
				collapseWhitespace: true,
				// collapseInlineTagWhitespace: true,
				preserveLineBreaks: true,
				keepClosingSlash: true,
			},
			files: {
				'index.html': 'index.html',
			}
		},
	});


	grunt.registerTask("build", ["clean", "copy", "http", "string-replace", "htmlmin"]);
	grunt.registerTask("default", ["build"]);
};