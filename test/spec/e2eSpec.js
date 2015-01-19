var should = require('chai').should(),
    chai = require('chai'),
    request = require('supertest'),
    appolo = require('../../index')
chaiHttp = require('chai-http');

chai.use(chaiHttp);


describe('Appolo Express', function () {

    describe('e2e', function () {

        beforeEach(function (done) {
            appolo.launcher.launch({
                port: 8183,
                environment: "testing",
                root: process.cwd() + '/test/mock/',
                paths: ['config', 'server']
            }, done);
        });

        afterEach(function () {
            appolo.launcher.softReset();
        });


        it('should should call route and get json', function (done) {

            request(appolo.launcher.app)
                .get('/test/')
                .expect(function (res) {

                    res.should.to.have.status(200);
                    res.should.to.be.json;

                    should.exist(res.body);

                    res.body.working.should.be.ok
                })
                .end(done)

        });

        it('should should call route from controller', function (done) {

            request(appolo.launcher.app)
                .get('/test/route/?user_name=11')
                .expect(function (res) {
                    res.should.to.have.status(200);
                    res.should.to.be.json;

                    should.exist(res.body)

                    res.body.working.should.be.ok

                    res.body.controllerName.should.be.eq('testRouteController')

                    res.body.model.userName.should.ok;
                })
                .end(done);
        });

        it('should  call middleware before controller', function (done) {

            request(appolo.launcher.app)
                .get('/test/middleware/')
                .expect(function (res) {


                    res.should.to.have.status(200);
                    res.should.to.be.json;

                    should.exist(res.body)

                    res.body.working.should.be.ok;

                    res.body.middleware.should.be.ok


                }).end(done);
        });

        it('should call validations error', function (done) {

            request(appolo.launcher.app)
                .get('/test/validations/')
                .expect(function (res) {
                    res.should.to.have.status(400);
                    res.should.to.be.json;

                    should.exist(res.body)

                    res.body.error.should.be.ok;

                })
                .end(done);
        });


        it('should call validations ', function (done) {

            request(appolo.launcher.app)
                .get('/test/validations/?username=aaa&password=1111')
                .expect(function (res) {
                    res.should.to.have.status(200);
                    res.should.to.be.json;

                    should.exist(res.body)

                    res.body.username.should.be.ok;
                })
                .end(done);
        });

        it('should call controller with modules ', function (done) {




            request(appolo.launcher.app)
                .get('/test/module/')
                .expect(function (res) {
                    res.should.to.have.status(200);
                    res.should.to.be.json;

                    should.exist(res.body)

                    res.body.logger.should.be.ok;

                    res.body.logger.should.be.eq("testinglogger2");

                }).end(done);
        });

    });


});