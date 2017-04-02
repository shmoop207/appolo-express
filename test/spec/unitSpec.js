"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai = require("chai");
const appolo = require("../../index");
let should = chai.should();
describe('Appolo Express Unit', () => {
    describe("basic test", () => {
        beforeEach(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appolo.launcher.launch({
                paths: ['config', 'server'],
                root: process.cwd() + '/test/mock'
            });
        }));
        afterEach(() => {
            appolo.launcher.reset();
        });
        it("should have app", () => {
            let app = appolo.inject.getObject('app');
            should.exist(app);
            should.exist(appolo.launcher.app);
        });
        it("should have managers", () => {
            let manager = appolo.inject.getObject('manager');
            should.exist(manager);
            should.exist(manager.manager2);
            should.exist(manager.manager3);
            should.exist(manager.manager3.manager2);
        });
        it("should have manager statics", function () {
            let manager = appolo.inject.getObject('manager3');
            manager.TEST.should.be.eq(1);
        });
        it("should have manager singleton", function () {
            let manager = appolo.inject.getObject('manager4');
            let manager2 = appolo.inject.getObject('manager4');
            (manager === manager2).should.be.ok;
        });
        it("should have manager namespace", function () {
            should.exist(global.TEST.Manager3);
        });
        it("should have valid env", function () {
            let env = appolo.inject.getObject('env');
            (env === appolo.environment).should.be.ok;
            env.type.should.be.eq("development");
        });
    });
});
//# sourceMappingURL=unitSpec.js.map