module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    shell: {
      npm_install: {
        command: 'npm install'
      }
    },

    connect: {
      options: {
        base: 'app/'
      },
      webserver: {
        options: {
          port: 8888,
          keepalive: true
        }
      },
      devserver: {
        options: {
          hostname: '0.0.0.0',
          port: 8888,
          middleware: function(connect, options) {
            var middlewares = [];
            var directory = options.directory || options.base[options.base.length - 1];
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }
            // Setup the proxy
            middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

            options.base.forEach(function(base) {
              // Serve static files.
              middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            middlewares.push(connect.directory(directory));

            return middlewares;
          }
        },
        proxies: [
          {
            context: '/api/v1',
            host: '0.0.0.0',
            port: 9090,
            rewrite: {
              '^/api/v1': ''
            }
          }
        ]
      },
      testserver: {
        options: {
          port: 9999
        }
      },
      coverage: {
        options: {
          base: 'coverage/',
          port: 5555,
          keepalive: true
        }
      }
    },

    express: {
      options: {
        // Override defaults here
      },
      api: {
        options: {
          script: 'api/server.js'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/js/*.js'
      ]
    },

    html2js: {
      options: {
        base: 'app'
      },
      main: {
        src: ['app/partials/**/*.html'],
        dest: 'app/js/templates.js'
      },
    },

    concat: {
      styles: {
        dest: './app/assets/app.css',
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.css',
          'bower_components/bootstrap/dist/css/bootstrap-theme.css',
          'app/css/app.css'
          //place your Stylesheet files here
        ]
      },
      scripts: {
        options: {
          separator: ';'
        },
        dest: './app/assets/app.js',
        src: [
          'bower_components/jquery/jquery.js',
          'bower_components/angular/angular.js',
          'bower_components/d3/d3.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-resource/angular-resource.js',
          'bower_components/angular-animate/angular-animate.js',
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/angular-spinkit/build/angular-spinkit.js',
          'app/js/config.js',
          'app/js/templates.js',
          'app/js/directives.js',
          'app/js/services.js',
          'app/js/filters.js',
          'app/js/controllers.js',
          'app/js/app.js'
          //place your JavaScript files here
        ]
      }
    },

    copy: {
      fontAwesome: {
        src: 'bower_components/bootstrap/dist/fonts/*',
        dest: 'app/fonts/',
        expand: true,
        flatten: true
      }
    },

    watch: {
      options: {
        livereload: 7777
      },
      assets: {
        files: ['app/css/**/*.css', 'app/js/**/*.js'],
        tasks: ['concat']
      },
      templates: {
        files: ['app/partials/**/*.html'],
        tasks: ['html2js', 'concat']
      }
    },

    open: {
      devserver: {
        path: 'http://0.0.0.0:8888'
      },
      coverage: {
        path: 'http://0.0.0.0:5555'
      }
    },

    karma: {
      unit: {
        configFile: './config/karma.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unit_auto: {
        configFile: './config/karma.conf.js',
        autoWatch: true,
        singleRun: false
      },
      e2e: {
        configFile: './config/karma-e2e.conf.js',
        autoWatch: false,
        singleRun: true
      },
      e2e_auto: {
        configFile: './config/karma-e2e.conf.js',
        autoWatch: true,
        singleRun: false
      },
      unit_coverage: {
        configFile: './config/karma.conf.js',
        autoWatch: false,
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
          'app/js/*.js': ['coverage']
        },
        coverageReporter: {
          type: 'html',
          dir: 'coverage/'
        }
      }
    }
  });

  //single run tests
  grunt.registerTask('test', ['jshint','test:unit']);
  grunt.registerTask('test:unit', ['karma:unit']);

  //autotest and watch tests
  grunt.registerTask('autotest', ['autotest:unit']);
  grunt.registerTask('autotest:unit', ['karma:unit_auto']);

  //coverage testing
  grunt.registerTask('test:coverage', ['karma:unit_coverage']);
  grunt.registerTask('coverage', ['karma:unit_coverage', 'open:coverage', 'connect:coverage']);

  //installation-related
  grunt.registerTask('update', ['shell:npm_install', 'html2js', 'concat', 'copy']);

  //defaults
  grunt.registerTask('default', ['dev']);

  //development
  grunt.registerTask('dev', ['update', 'express:api', 'configureProxies:devserver',
    'connect:devserver', 'watch']);

  //server daemon
  grunt.registerTask('serve', ['connect:webserver']);
};
