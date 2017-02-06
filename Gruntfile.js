const auth = require('./auth.json');
const load_grunt_tasks = require('load-grunt-tasks');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const underscore = require('underscore');

module.exports = function (grunt) {

  load_grunt_tasks(grunt);

  grunt.loadNpmTasks('grunt-screeps');
  grunt.loadNpmTasks("grunt-webpack");

  grunt.initConfig({
    webpack: {
      screeps: {
        target: 'node',
        entry: './src/main.js',
        output: {
          path: './dist/',
          filename: 'main.js',
          libraryTarget: "commonjs2"
        },
        stats: {
          colors: true,
          modules: true,
          reasons: true,
          errorDetails: true
        },
        plugins: [function () {
          this.plugin("done", function (stats) {
            var jsPath = path.join(__dirname, 'dist', 'main.js');
            var template = fs.readFileSync(jsPath, 'utf8');
            var js_template = underscore.template(template);
            var js = js_template({hash: stats.hash});

            fs.writeFileSync(jsPath, js);
          });
        }
        ],
      }
    },
    screeps: {
      options: {
        email: auth.username,
        password: auth.password,
        branch: 'default',
        ptr: false
      },
      dist: {
        src: ['dist/main.js']
      }
    },
  });

  grunt.registerTask('default', ['webpack', 'screeps']);
};