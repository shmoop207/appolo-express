"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("../../../index");
class Middleware extends appolo.Middleware {
    run(req, res, next) {
        res.send({ working: true, middleware: true });
    }
}
module.exports = appolo.define('testMiddleware', Middleware).inject('manager');
//# sourceMappingURL=middleware.js.map