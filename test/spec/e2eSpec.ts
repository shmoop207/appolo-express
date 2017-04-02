import    chai = require('chai');
import    request = require('supertest');
import   appolo = require('../../index');
import   chaiHttp = require('chai-http');

let should = chai.should()
chai.use(chaiHttp)


describe('Appolo Express', () => {

    describe('e2e', function () {

        beforeEach(async () => {
            return appolo.launcher.launch({
                port: 8183,
                environment: "testing",
                root: process.cwd() + '/test/mock/',
                paths: ['config', 'server']
            });
        });

        afterEach(() => {
            appolo.launcher.reset();
        });


        it('should should call route and get json', async () => {

            let res = await request(appolo.launcher.app)
                .get('/test/')

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok

        });

        it('should should call route from controller', async () => {

            let res = await request(appolo.launcher.app)
                .get('/test/route/?user_name=11');

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok

            res.body.controllerName.should.be.eq('testRouteController')

            res.body.model.userName.should.ok;
        });

        it('should  call controller from static $route', async () => {

            let res = await request(appolo.launcher.app)
                .get('/test/route/static/?user_name=11');


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok

            res.body.controllerName.should.be.eq('routeStaticController')

            res.body.model.userName.should.ok;
        });

        it('should  call controller from static linq', async () => {

            let res = await request(appolo.launcher.app)
                .get('/test/route/linq/?user_name=11');

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok

            res.body.controllerName.should.be.eq('routeLinqController')

            res.body.model.userName.should.ok;
        });

        it('should  call controller from static linq object', async () => {


            let res = await request(appolo.launcher.app)
                .get('/test/route/linq_object/?user_name=11')

            res.should.to.have.status(200);

            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok

            res.body.controllerName.should.be.eq('routeLinqController')

            res.body.model.userName.should.ok;
        });

        it('should  call controller from linq fluent', async () => {

            let res = await request(appolo.launcher.app)
                .get('/test/route/fluent/?user_name=11')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok

            res.body.controllerName.should.be.eq('routeLinqController')

            res.body.model.userName.should.ok;
        });

        it('should  call controller from linq fluent method', async () => {

            let res = await request(appolo.launcher.app)
                .get('/test/route/fluent_method/?user_name=11')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok

            res.body.controllerName.should.be.eq('routeLinqController')

            res.body.model.userName.should.ok;
        });

        it('should  call controller from decorator', async () => {

            let res = await request(appolo.launcher.app)
                .get('/test/route/decorator/?user_name=11')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok

            res.body.controllerName.should.be.eq('routeDecoratorsController')

            res.body.model.userName.should.ok;
            res.body.name.should.be.eq("Manager4");

        });


        it('should  call middleware before controller', async () => {

            let res = await request(appolo.launcher.app)
                .get('/test/middleware/')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok;

            res.body.middleware.should.be.ok
        });

        it('should call validations error', async () => {

            let res = await request(appolo.launcher.app)
                .get('/test/validations/')


            res.should.to.have.status(400);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.error.should.be.ok;
        });


        it('should call validations ', async () => {

            let res = await request(appolo.launcher.app)
                .get('/test/validations/?username=aaa&password=1111');


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.username.should.be.ok;
        });

        it('should call controller with modules ', async () => {


            let res = await request(appolo.launcher.app)
                .get('/test/module/');

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.logger.should.be.ok;

            res.body.logger.should.be.eq("testinglogger2");
        });

        it('should not call route with env if not in environments', async ()=> {

            let res = await request(appolo.launcher.app)
                .get('/test/route/not_in_env/')


            res.should.to.have.status(404);
        });


        it('should call route with env', async ()=> {

            let res = await request(appolo.launcher.app)
                .get('/test/route/env/');


            res.should.to.have.status(200);
        });

    });


});