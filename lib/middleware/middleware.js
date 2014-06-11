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

    }
});
