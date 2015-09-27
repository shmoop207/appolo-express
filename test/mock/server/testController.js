"use strict";
var appolo = require('../../../index');

let $config = {
    id: 'testController',
    inject: ['manager']
};
class Controller extends appolo.Controller {


    test(req, res) {
        res.json({working: true})
    }

    validaion(req, res) {
        res.json(req.model)
    }

}

module.exports = appolo.define($config, Controller);