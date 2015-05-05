/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Task configuration.
        watch: {
            // Manually added tasks to watch.
            scripts: {
                files: ['src/**/*', 'lib/**/*'],
                tasks: ['autoprefixer', 'metalsmith', 'jasmine'],
                options: {
                    spawn: false
                },
            }
        },

        // Manually added plugins.
        // for testing js (game) logic
        jasmine: {
            pivotal: {
                src: ['src/js/*.js'],
                options: {
                    specs: 'spec/*Spec.js',
                    vendor: 'src/components/jquery/dist/jquery.min.js',
                    helpers: 'spec/*Helper.js',
                    keepRunner: true
                }
            }
        },
        // automatically generates css rules for multi-browser support
        autoprefixer: {
            single_file: {
				options: {
					browsers: ['last 2 chrome versions', 'last 2 firefox versions', 'ie 9', 'ie 10', 'ie 11']
				},
				src: 'src/css/style.scss',
				dest: 'src/css/style.scss'
			},
        },
        // additional plugins
        metalsmith: {
		    blockToss: {
		        options: {
		            metadata: {
		                title: 'blockToss',
		                description: "A simple puzzle game akin to Tetris but upside-down. The player moves a cursor left and right at the bottom and throws tiles/blocks at the generating blocks above. Three attached tiles of identical color (doesn't have to be a straight line, just touching) will cause the tiles to erase."
		            },
		            plugins: {
		                'metalsmith-permalinks': {
		                    pattern: ':title'
		                },
		                "metalsmith-sass": {
					    	"outputStyle": "compressed"
					    }
		            }
		        },
		        src: 'src',
		        dest: 'build'
		    }
		}
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-metalsmith');

    // Default task.
    grunt.registerTask('default', ['autoprefixer', 'metalsmith', 'jasmine']);

};
