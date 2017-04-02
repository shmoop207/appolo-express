"use strict";
import appolo = require('../../../index');



class Middleware extends appolo.Middleware {

    run(req, res, next) {
        res.send({working: true, middleware: true})
    }
}


module.exports = appolo.define('testMiddleware',Middleware).inject('manager')