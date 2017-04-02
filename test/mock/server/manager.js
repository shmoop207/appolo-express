"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("../../../index");
let $config = {
    id: 'manager',
    singleton: true,
    inject: ['manager2', 'manager3']
};
class Manager {
    get name() {
        return this.constructor.name;
    }
}
exports.Manager = Manager;
appolo.define('manager')
    .type(Manager)
    .inject('manager2 manager3')
    .singleton();
//# sourceMappingURL=manager.js.map