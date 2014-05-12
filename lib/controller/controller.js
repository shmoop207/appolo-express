"use strict";

var Class = require('appolo').Class,
    path = require('path'),
    _ = require('lodash');

module.exports = Class.define({

    constructor: function (req, res, next, controllerName) {

        this.req = req;
        this.res = res;
        this.next = next;
        this.name = controllerName;
    },

    initialize: function () {

    },

    invoke: function (action) {

        if (typeof this[action] !== 'function') {
            throw new Error(this.name + ' ' + action + ' is not a function');
        }

        this.action = action;

        this[action](this.req, this.res, this.next);

    },

    render: function (view, model) {
        if (!model) {
            model = view;

            view = path.join(this.name, this.action);
        }

        this.res.render(view, model);
    },

    jsonError: function (message) {

        this.res.jsonp({
            success: false,
            message: message
        });
    },

    jsonSuccess: function (data) {
        this.res.jsonp({
            success: true,
            data: data
        });
    },

    serverError: function (message) {

        this.res.send(500 , message)
    },

    getName: function () {
        return this.name;
    }
});
