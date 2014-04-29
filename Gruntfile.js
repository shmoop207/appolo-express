

module.exports = function (grunt) {

    grunt.initConfig({

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        },
        express: {
            test: {
                options: {
                    script: 'test/mock/app.js',
                    port: 8182,
                    //delay: 1000,
                    output: ".*listening.*",
                    node_env: 'testing'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-express-server');

    grunt.registerTask('test', ['express:test','mochaTest']);

    grunt.registerTask('default', 'test');

};
