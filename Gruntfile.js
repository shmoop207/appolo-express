

module.exports = function (grunt) {

    grunt.initConfig({

        mochaTest: {
            e2e: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/spec/e2eSpec.js']
            },
            unit: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/spec/unitSpec.js']
            }
        },
        //express: {
        //    test: {
        //        options: {
        //            script: 'test/mock/app.js',
        //            port: 8183,
        //            //delay: 1000,
        //            output: ".*listening.*",
        //            node_env: 'testing'
        //        }
        //    }
        //}
    });

    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', ['mochaTest:unit','mochaTest:e2e']);

    grunt.registerTask('default', 'test');

};
