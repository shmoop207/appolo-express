var should = require('chai').should(),
    chai = require('chai'),
    appolo = require('../index')


describe('Appolo Express Unit', function () {

    describe("basic test",function(){
        beforeEach(function(){
            appolo.launcher.launch({
                paths: ['config', 'server'],
                root: process.cwd() + '/test/mock'
            });


        })

        afterEach(function(){
            appolo.launcher.reset();
        })

        it("should have app",function(){

            var app = appolo.inject.getObject('app');

            should.exist(app)
            should.exist(appolo.launcher.app)
        })

    });
});