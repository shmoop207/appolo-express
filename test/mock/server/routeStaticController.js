"use strict";
var appolo = require('../../../index');

module.exports  = class Controller extends appolo.Controller {

    static get $config()  {
        return {
            id: 'routeStaticController'
        }
    }

    static get $routes()  {
        return  [
            {
                abstract: true,
                validations: {
                    user_name: appolo.validator.string().required()
                }
            },
            {
                path: '/test/route/static',
                method: 'get',
                action: 'test'
            }

        ]
    }

    test(req, res) {
        res.json({working: true, controllerName: this.route.controller, model: req.model})
    }

}
