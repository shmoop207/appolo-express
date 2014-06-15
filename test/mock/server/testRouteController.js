var Controller = require('../../../lib/controller/controller');
module.exports = Controller.define({
    $config: {
        id: 'testRouteController',
        routes: [
            {
                path: '/test/route/',
                method: 'get',
                action: 'test',
            }
        ]
    },

    test: function (req, res) {
        res.json({working: true, controllerName: this.route.controller})
    }

})