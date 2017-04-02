"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("../../../index");
let $config = {
    id: 'moduleController',
    inject: ['logger2'],
    routes: [
        {
            path: '/test/module/',
            method: "get",
            action: 'test'
        }
    ]
};
class Controller extends appolo.Controller {
    test(req, res) {
        res.json({ working: true, controllerName: this.route.controller, logger: this.logger2.getName() });
    }
}
exports.Controller = Controller;
appolo.define($config, Controller);
//# sourceMappingURL=moduleController.js.map