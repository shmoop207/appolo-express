"use strict";

var Class = require('appolo').Class,
    path = require('path'),
    _ = require('lodash');

module.exports = Class.define({

    constructor: function (req, res, next, route) {

        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    },

    run: function (req,res,next,route) {

        next();

    },
    sendServerError:function(error,code) {
        this.res.status(500).jsonp({
            status: 500,
            statusText: "Internal Server Error",
            error:error,
            code:code
        });
    },

    sendBadRequest:function(error,code) {
        this.res.status(400).jsonp({
            status: 400,
            statusText: "Bad Request",
            error:error,
            code:code
        });
    },

    sendUnauthorized:function(error,code) {
        this.res.status(401).jsonp({
            status: 401,
            statusText: "Unauthorized",
            error:error,
            code:code
        });
    },

    sendNotFound:function(error,code) {
        this.res.status(404).jsonp({
            status: 404,
            statusText: "Not Found",
            error:error,
            code:code
        });
    }
});
