"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const appolo_1 = require("appolo");
const controller_1 = require("../controller/controller");
const router_1 = require("../routes/router");
class Define extends appolo_1.Define {
    routes(routes) {
        if (this._klass === controller_1.Controller || this._klass.prototype instanceof controller_1.Controller) {
            if (router_1.default && _.isArray(routes)) {
                router_1.default.addRoutes(this.id, routes);
            }
            if (router_1.default && _.isObject(routes)) {
                router_1.default.addRoutes(this.id, [routes]);
            }
        }
        return this;
    }
}
exports.Define = Define;
//# sourceMappingURL=define.js.map