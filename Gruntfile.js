// 'newer' plugin is used to only update files with a newer timestamp (during development)

// Two beeps = A task has succesfully completed
// One beep = Something has failed


module.exports = function(grunt) {
	require('load-grunt-config')(grunt); // Save us having to do grunt.loadNpmTasks() for every plugin we use
	require('time-grunt')(grunt); // Get timings of how long each task took (more useful for 'build' than 'develop')

	var port = 4000;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	

		// Empty out the contents of dist for a fresh build
		clean: {
			all: ['dist/']
		},

		// Copy over files from src to dist
		copy: {
			options: {},
			scripts: {
				expand: true,
				cwd: 'src/',
				// Copy all JS
				src: ['scripts/lib/**/*.js', 'scripts/**/*.js'],
				dest: 'dist/',
				filter: 'isFile'
			},
			html: {
				expand: true,
				cwd: 'src/',
				// Copy all HTML except the /includes folder
				src: ['**/*.html', '!**/includes/**'],
				dest: 'dist/',
				filter: 'isFile'
			},
			images: {
				expand: true,
				cwd: 'src/',
				// Copy all images
				src: ['img/**/*.{png,jpg,gif,svg}'],
				dest: 'dist/',
				filter: 'isFile'
			},
			develop: {
				expand: true,
				cwd: 'src/',
				// Copy unhandled file types/folders
				src: ['**', '!less/*', '!images/*', '!includes/*', '!pages/*','!js/custom/*'],
				dest: 'dist/',
				filter: 'isFile'
			},
			build: {
				expand: true,
				cwd: 'src/',
				// Copy anything which isn't LESS, SASS, JS, images and HTML (as they will be handled by other tasks)
				src: ['**', '!less/*', '!styles/**/*.css.map', '!js/custom/*', '!images/*', '!includes/*', '!pages/*'],
				dest: 'build/',
				filter: 'isFile'
			}

		},

		// Run JShint on all of JS files (but not on vendor files)
		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			all: ['Gruntfile.js', 'src/js/custom/**/*.js']
		},
		
		concat: {
		    options: {
		      separator: ';'
		    },
		    dest: {
			  src: ['src/js/custom/**/*.js'],
		      dest: 'dist/js/build.js'
		    }
		  },

		 
		// Run uglify to minify all JS files
		 uglify: {
		    my_target: {
		      files: {
		        'build/js/build.min.js': 'dist/js/build.js'
		      }
		    }
		},

			cssmin: {
			    options: {
			        relativeTo: './',
			        compatibility: 'ie8'
			    },
			    target: {
			        files: [{
			        	     expand: true,
      						cwd: 'dist/css',
      						src: ['*.css', '!*.min.css'],
      						dest: 'build/css',
      						ext: '.min.css'
			        }]
			    }
			},
		// Automatically compile LESS into CSS
		less: {
			all: {
				expand: true,
				cwd: 'src/less',
				// src: ['**/*.less'],
				src: ['main.less'],
				dest: 'dist/css',
				ext: '.css'
			},
			ie: {
				expand: true,
				cwd: 'src/less',
				// src: ['**/*.less'],
				src: ['ie.less'],
				dest: 'dist/css',
				ext: '.css'
			}

		},

	    /*
	    Clean SVGs from Illustrator/Sketch
	    */
	    svgmin: {
	        options: {
	            plugins: [
	                { removeViewBox: false },
	                { removeUselessStrokeAndFill: false }
	            ]
	        },
	        ui: {                       // Target
	            files: [{               // Dictionary of files
	                expand: true,       // Enable dynamic expansion.
	                cwd: 'src/img/sprites/separate',     // Src matches are relative to this path.
	                src: ['**/*.svg'],  // Actual pattern(s) to match.
	                dest: 'dist/img/sprites/separate',       // distination path prefix.
	                ext: '.svg'     // dist filepaths will have this extension.
	            }]
	        }
	    },
	    "svg-sprites": {
	        "sprite-main": {
	            options: {
	                spriteElementPath: "src/img/sprites/separate",
	                spritePath: "src/img/sprites/sprite.svg",
	                cssPath: "src/less/sprites.less",
	                prefix: "icon",
	                sizes: {
	                  lrg: 30,
	                  sml: 20
	                },
	                refSize: 31,
	                unit: 20
	            }
	        }
	    },

	    svg2png: {
        	all: {
            	// specify files in array format with multiple src-dist mapping 
            	files: [
                	// rasterize all SVG files in "img" and its subdirectories to "img/png" 
                	{ cwd: 'src/content/img/', src: ['**/*.svg'], dest: 'dist/img/' }
            	]
        	}
    	},

		// Optimise all image files
		imagemin: {
			options: {},
			build: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'dist/'
				}]
			}
		},

		// Process our HTML includes
		processhtml: {
			options: {},
			develop: {
				files: [{
					expand: true,
					cwd: 'src/pages',
					src: ['**/*.html', '!includes/**/*.html'],
					dest: 'dist/'
				}]
			},
			build: {
				files: [{
					expand: true,
					cwd: 'dist/',
					src: ['**/*.html', '!includes/**/*.html'],
					dest: 'build/'
				}]
			}
		},

		// Launch a local development server with LiveReloading
		connect: {
			options: {
				port: port,
				base: 'dist/',
				hostname: '*',
				livereload: true
			},
			livereload: {
				options: {
					open: {
						target: 'http://localhost:' + port
					},
					base: [
						'dist/'
					]
				}
			}
		},

		// Watch for file changes
		watch: {
			less: {
				files: ['src/content/less/**/*.less'],
				tasks: ['less', 'beep:error:*', 'cssmin'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			scripts: {
				files: 'src/js/**/*.js',
				tasks: ['newer:jshint', 'beep:error:*', 'newer:copy:scripts', 'concat', 'uglify'], // Only copy files that have changed
				options: {
					livereload: true,
					nospawn: true
				}
			},

			html: {
				files: ['src/**/*.html', '!src/includes/**/*.html'],
				tasks: ['newer:processhtml:develop'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			includes: {
				files: 'src/includes/**/*.html',
				tasks: ['processhtml:develop'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			images: {
				files: 'src/content/images/**/*',
				tasks: ['newer:copy:images'],
				options: {
					livereload: true,
					nospawn: true
				}
			}
		}
	});

// Detect what IP address the local webserver is running
	grunt.registerTask('getip', 'Tells you the ip address your server is running on.', function() {
		var os = require("os");
		var ifaces = os.networkInterfaces();
		var ip = "";
		var alias = 0;

		function checker(details) {
			if (details.family == "IPv4") {
				if (dev == "Local Area Connection") ip = details.address;

				++alias;
			}
		}

		for (var dev in ifaces) {
			ifaces[dev].forEach(checker);
		}

		var serverMessage = 'Your server is running on: http://' + ip + ':' + port;

		grunt.log.writeln('');
		grunt.log.writeln(serverMessage.green);
	});

//for now
  	grunt.registerTask('default', ['clean:all','develop']);
  	
	// 'develop' task for active site development
	grunt.registerTask('develop', ['jshint', 'clean:all',  'copy:develop', 'svg-sprites' ,'less',  'concat', 'processhtml:develop','connect', 'getip','beep:error:*', 'beep:**', 'watch']);

	// 'build' task for creating a clean, optimised set of files for distribution
	grunt.registerTask('build',   ['jshint', 'clean:all', 'copy:build', 'svgmin', 'svg-sprites','less','concat', 'uglify', 'cssmin', 'svg2png', 'imagemin', 'processhtml:develop', 'processhtml:build', 'beep:error:*', 'beep:**']);
};