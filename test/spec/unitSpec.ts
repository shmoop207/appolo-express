import    chai = require('chai');
import    appolo = require('../../index');
import {Manager} from "../mock/server/manager";
import {Manager3} from "../mock/server/manager3";
import {Manager4} from "../mock/server/manager4";

let should = chai.should()


describe('Appolo Express Unit', () => {

    describe("basic test", () => {

        beforeEach(async () => {
            return appolo.launcher.launch({
                paths: ['config', 'server'],
                root: process.cwd() + '/test/mock'
            });
        });

        afterEach(() => {
            appolo.launcher.reset();
        });

        it("should have app", () => {

            let app = appolo.inject.getObject('app');

            should.exist(app);
            should.exist(appolo.launcher.app)
        });

        it("should have managers", () => {

            let manager = appolo.inject.getObject<Manager>('manager');

            should.exist(manager);
            should.exist(manager.manager2);
            should.exist(manager.manager3);
            should.exist(manager.manager3.manager2)

        });

        it("should have manager statics", function () {

            let manager = appolo.inject.getObject<Manager3>('manager3');

            manager.TEST.should.be.eq(1)

        });

        it("should have manager singleton", function () {

            let manager = appolo.inject.getObject<Manager4>('manager4');
            let manager2 = appolo.inject.getObject<Manager4>('manager4');

            (manager === manager2).should.be.ok;

        });

        it("should have manager namespace", function () {

            should.exist((global as any).TEST.Manager3)

        });

        it("should have valid env", function () {

            let env = appolo.inject.getObject<appolo.IEnv>('env');

            (env === appolo.environment).should.be.ok;

            env.type.should.be.eq("development")

        })

    });
});