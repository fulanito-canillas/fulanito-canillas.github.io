/*global module*/
"use strict";

module.exports = function(grunt) {

	grunt.config("pkg", grunt.file.readJSON("package.json"));
	grunt.config("properties", grunt.file.readJSON("properties.json"));
	grunt.config("CNAME", grunt.file.read("CNAME", { encoding: 'utf8' }));

	grunt.config("paths", {
		"destAssets": "workspace/assets",
		"srcAssets": "workspace/assets",
		"destRoot": "",
		"srcRoot": "http://localhost/projects/folio-sym",
		"fontFiles": "{eot,otf,svg,ttf,woff,woff2}",
		"mediaFiles": "{ico,cur,gif,jpg,jpeg,mp4,png,svg,webp,webm}",
	});

	/* --------------------------------
	/* clean:resources
	/* -------------------------------- */

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.config("clean", {
		scripts: {
			src: [
				"workspace/assets/js",
				"workspace/assets/css"
			]
		},
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
					"images/{mockup,symbols,cursors}/*.<%= paths.mediaFiles %>",
					"images/favicons/black/*.<%= paths.mediaFiles %>",
					"images/{debug,favicons/white}/*.<%= paths.mediaFiles %>",
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

	/* --------------------------------
	 * grunt-http
	 * -------------------------------- */

	grunt.loadNpmTasks("grunt-http");
	grunt.config("http", [
		"css/folio.css",
		"css/folio.css.map",
		"js/folio.js",
		"js/folio.js.map",
		"css/folio-dev.css",
		"css/folio-dev.css.map",
		"js/folio-dev-main.js",
		"js/folio-dev-main.js.map",
		"js/folio-dev-vendor.js",
		"js/folio-dev-vendor.js.map",
	].reduce((o, s, i, a) => {
		o[s.replace(/[\/\.]/g, "-")] = {
			options: { url: `<%= paths.srcRoot %>/<%= paths.srcAssets %>/${s}` },
			dest: `<%= paths.destAssets %>/${s}`
		};
		return o;
	}, {
		options: {
			ignoreErrors: true
		},
		"index-dev": {
			options: { url: "<%= paths.srcRoot %>/?force-debug=yes" },
			dest: "index.html"
		},
		"index-dist": {
			options: { url: "<%= paths.srcRoot %>/?force-nodebug=yes" },
			dest: "index.html"
		},
		// "data-json": {
		// 	options: { url: "<%= paths.srcRoot %>/json" },
		// 	dest: "<%= paths.destAssets %>/js/data.json"
		// },
		// "data-jsonp": {
		// 	options: { url: "<%= paths.srcRoot %>/json?callback=bootstrap" },
		// 	dest: "<%= paths.destAssets %>/js/data.js"
		// },
	}));

	grunt.registerTask("http-assets",
		Object.keys(grunt.config("http"))
		.filter(key => key !== "options")
		.map(key => `http:${key}`)
	);

	/* --------------------------------
	 * copy/process
	 * -------------------------------- */

	var toPattern = function(s) {
		s = grunt.template.process(s, grunt.config());
		s = s.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		s += "\\/?";
		grunt.log.writeln("RegExp: /" + s + "/g");
		return new RegExp(s, "g");
	};

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
					{
						pattern: toPattern("<%= paths.srcRoot %>"),
						replacement: "<%= paths.destRoot %>"
					},
					{
						pattern: /UA\-\d+\-\d+/g,
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
				// preserveLineBreaks: true,
				keepClosingSlash: true,
			},
			files: {
				'index.html': 'index.html',
			}
		},
	});

	/* --------------------------------
	 * git
	 * -------------------------------- */

	grunt.loadNpmTasks('grunt-git');
	grunt.config('gitadd.main', {
		options: {
			all: true,
			force: false
		}, // files: { src: ['*', 'workspace/**/*'] }
	});
	grunt.config('gitcommit.main', {
		options: {
			message: '---'
		}
	});
	grunt.config('gitpush.main', {
		options: {}
	});

	// grunt.registerTask('deploy', 'force git', function() {
	//	let forced = ["gitadd:main", "gitcommit:main", "gitpush:main"]
	// 	grunt.option('force', true);
	// 	grunt.task.run(forced);
	// });
	grunt.registerTask("deploy", ["gitadd:main", "gitcommit:main", "gitpush:main"]);

	grunt.registerTask("build-resources", ["clean:resources", "clean:scripts", "copy", "http-assets"])
	grunt.registerTask("dev", ["build-resources", "http:index-dev", "string-replace", "htmlmin"]);
	grunt.registerTask("dist", ["build-resources", "http:index-dist", "string-replace", "htmlmin"]);
	grunt.registerTask("default", ["dist"]);
};
