var should = require('chai').should(),
    chai = require('chai'),
    appolo = require('../../index')


describe('Appolo Express Unit', function () {

    describe("basic test",function(){

        beforeEach(function(done){
            appolo.launcher.launch({
                paths: ['config', 'server'],
                root: process.cwd() + '/test/mock'
            },done);


        })

        afterEach(function(){
            appolo.launcher.reset();
        })

        it("should have app",function(){

            var app = appolo.inject.getObject('app');

            should.exist(app)
            should.exist(appolo.launcher.app)
        })

        it("should have managers",function(){

            var manager = appolo.inject.getObject('manager');

            should.exist(manager)
            should.exist(manager.manager2)
            should.exist(manager.manager3)
            should.exist(manager.manager3.manager2)

        })

        it("should have manager statics",function(){

            var manager = appolo.inject.getObject('manager3');

            manager.TEST.should.be.eq(1)

        })

        it("should have manager namespace",function(){

            should.exist(TEST.Manager3)

        })

    });
});