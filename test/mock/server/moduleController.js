var Controller = require('../../../lib/controller/controller');
var validator = require('joi');
module.exports = Controller.define({
    $config: {
        id: 'moduleController',
        inject:['logger2'],
        routes: [
            {
                path: '/test/module/',
                method: 'get',
                action: 'test'
            }
        ]
    },

    test: function (req, res) {
        res.json({working: true, controllerName: this.route.controller,logger:this.logger2.getName()})
    }

})