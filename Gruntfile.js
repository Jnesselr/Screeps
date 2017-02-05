const auth = require('./auth.json');
const load_grunt_tasks = require('load-grunt-tasks');

module.exports = function(grunt) {

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
                }
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