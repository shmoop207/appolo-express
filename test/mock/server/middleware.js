"use strict";
var appolo = require('../../../index');

let $config = {
    id: 'testMiddleware',
    inject: ['manager']
};

class Middleware extends appolo.Middleware {

    run(req, res, next) {
        res.send({working: true, middleware: true})
    }
}


module.exports = appolo.define($config,Middleware)