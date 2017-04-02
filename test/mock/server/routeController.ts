"use strict";
import appolo = require('../../../index');

let $config = {
    id: 'testRouteController',
    routes: [
        {
            abstract: true,
            validations: {
                user_name: appolo.validator.string().required()
            }
        },
        {
            path: '/test/route/',
            //method: 'get',
            action: 'test'
        }

    ]
};

class Controller extends appolo.Controller {

    test(req, res) {
        res.json({working: true, controllerName: this.route.controller, model: req.model})
    }

}

 appolo.define($config, Controller);