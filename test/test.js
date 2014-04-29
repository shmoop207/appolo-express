var should = require('chai').should();
var appolo  = require('../index');


describe('Appolo', function () {

    beforeEach(function(){

    })

    afterEach(function(){
        appolo.launcher.reset();
    })

    describe('environments', function () {

        it('should create dev environment ', function () {

            appolo.launcher.launch({
                paths:['config', 'server'],
                root:process.cwd() +'/test/mock'
            });

            should.exist(appolo.environment.test);

            appolo.environment.test.should.be.equal("testDev")
            appolo.environment.type.should.be.equal("development")
        });


        it('should create dev environment ', function () {

            appolo.launcher.launch({
                paths:['config', 'server'],
                root:process.cwd() +'/test/mock',
                environment:'production'
            });

            should.exist(appolo.environment.test);

            appolo.environment.test.should.be.equal("testProd")

            appolo.environment.type.should.be.equal("production")
        });
    });

    describe('server injector', function () {
        beforeEach(function(){
            appolo.launcher.launch({
                paths:['config', 'server'],
                root:process.cwd() +'/test/mock'
            });
        })

        it('should have  injector', function () {
            var injector = appolo.inject;

            should.exist(injector)

        });

        it('should have env in injector', function () {
            var injector = appolo.inject;

            var env = injector.getObject('env');

            should.exist(env);

            env.type.should.be.equal("development")

        });

        it('should have controller in injector', function () {
            var injector = appolo.inject;

            var controller = injector.getObject('controller');

            should.exist(controller);
            should.exist(controller.manager);
        });

    });

    describe('server bootstrap', function () {
        beforeEach(function () {
            appolo.launcher.launch({
                paths: ['config', 'server'],
                root: process.cwd() + '/test/mock'
            });
        });

        it('should have  call bootstrap initialize', function () {
            var injector = appolo.inject;

            var bootstrap = injector.getObject('appolo-bootstrap');

            should.exist(bootstrap);
            bootstrap.working.should.be.ok;
        });
    });


});