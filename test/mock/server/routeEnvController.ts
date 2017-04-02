"use strict";
import appolo = require('../../../index');

let $config = {
    id: 'routeEnvController',
    routes: [
        {
            path: '/test/route/not_in_env/',
            //method: 'get',
            action: 'test',
            environments: ['test']
        },

        {
            path: '/test/route/env/',
            //method: 'get',
            action: 'test',
            environments: ['testing']
        }
    ]
};

class Controller extends appolo.Controller {

    test(req, res) {
        res.json({working: true, controllerName: this.route.controller})
    }

}

 appolo.define($config, Controller);