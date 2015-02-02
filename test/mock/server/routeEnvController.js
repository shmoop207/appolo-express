var Controller = require('../../../lib/controller/controller');
var validator = require('joi');
module.exports = Controller.define({
    $config: {
        id: 'routeEnvController',
        routes: [
            {
                path: '/test/route/not_in_env/',
                method: 'get',
                action: 'test',
                environments:['test']
            },

            {
                path: '/test/route/env/',
                method: 'get',
                action: 'test',
                environments:['testing']
            }
        ]
    },

    test: function (req, res) {
        res.json({working: true, controllerName: this.route.controller})
    }

})