"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("../../../index");
class Manager3 {
    get name() {
        return this.constructor.name;
    }
}
exports.Manager3 = Manager3;
appolo.define('manager3')
    .type(Manager3)
    .singleton()
    .statics("TEST", 1)
    .namespace("TEST.Manager3")
    .inject('manager2');
//# sourceMappingURL=manager3.js.map