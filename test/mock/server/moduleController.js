"use strict";
var appolo = require('../../../index');

let $config = {
    id: 'moduleController',
    inject: ['logger2'],
    routes: [
        {
            path: '/test/module/',
            method: 'get',
            action: 'test'
        }
    ]
}

class Controller extends appolo.Controller {
    test(req, res) {
        res.json({working: true, controllerName: this.route.controller, logger: this.logger2.getName()})
    }

}

module.exports = appolo.define($config, Controller)