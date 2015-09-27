"use strict";

var path = require('path'),
    _ = require('lodash');

module.exports = class Midddleware{

    constructor (req, res, next, route) {

        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    }

    run (req,res,next,route) {

        next();

    }

    sendServerError(error,code) {
        this.res.status(500).jsonp({
            status: 500,
            statusText: "Internal Server Error",
            error:error,
            code:code
        });
    }

    sendBadRequest(error,code) {
        this.res.status(400).jsonp({
            status: 400,
            statusText: "Bad Request",
            error:error,
            code:code
        });
    }

    sendUnauthorized(error,code) {
        this.res.status(401).jsonp({
            status: 401,
            statusText: "Unauthorized",
            error:error,
            code:code
        });
    }

    sendNotFound(error,code) {
        this.res.status(404).jsonp({
            status: 404,
            statusText: "Not Found",
            error:error,
            code:code
        });
    }
}
