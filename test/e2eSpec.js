var should = require('chai').should(),
    chai = require('chai'),
    chaiHttp = require('chai-http');

chai.use(chaiHttp);


describe('Appolo Express', function () {

    describe('e2e', function () {

        it('should should call route and get json', function (done) {

            chai.request('http://localhost:8183')
                .get('/test/')
                .res(function (res) {
                    res.should.to.have.status(200);
                    res.should.to.be.json;

                    should.exist(res.body)

                    res.body.working.should.be.ok

                    done();
                });
        });

        it('should should call route from controller', function (done) {

            chai.request('http://localhost:8183')
                .get('/test/route/')
                .res(function (res) {
                    res.should.to.have.status(200);
                    res.should.to.be.json;

                    should.exist(res.body)

                    res.body.working.should.be.ok

                    res.body.controllerName.should.be.eq('testRouteController')

                    done();
                });
        });

        it('should should call middleware before controller', function (done) {

            chai.request('http://localhost:8183')
                .get('/test/middleware/')
                .res(function (res) {
                    res.should.to.have.status(200);
                    res.should.to.be.json;

                    should.exist(res.body)

                    res.body.working.should.be.ok

                    res.body.middleware.should.be.ok

                    done();
                });
        });
    });


});