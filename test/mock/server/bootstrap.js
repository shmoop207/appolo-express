"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("../../../index");
class Bootstrap {
    run(callback) {
        this.working = true;
        setTimeout(callback, 10);
    }
}
exports.Bootstrap = Bootstrap;
appolo.define('appolo-bootstrap', Bootstrap)
    .singleton()
    .inject("manager");
//# sourceMappingURL=bootstrap.js.map