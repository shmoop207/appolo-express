"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("../../../decorators");
let Manager4 = class Manager4 {
    get name() {
        return this.constructor.name;
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], Manager4.prototype, "manager3", void 0);
Manager4 = tslib_1.__decorate([
    decorators_1.define(),
    decorators_1.singleton()
], Manager4);
exports.Manager4 = Manager4;
//# sourceMappingURL=manager4.js.map