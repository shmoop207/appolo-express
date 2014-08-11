"use strict";

var Class = require('appolo').Class,
    path = require('path'),
    _ = require('lodash'),
    deprecate = require('depd')('appolo-express');

module.exports = Class.define({

    constructor: function (req, res, next, route) {

        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    },

    initialize: function () {

    },

    invoke: function (action) {

        if (typeof this[action] !== 'function') {
            throw new Error(this.route.controller + ' ' + action + ' is not a function');
        }

        this.action = action;

        this[action](this.req, this.res, this.next);

    },

    render: function (view, model) {
        if (!model) {
            model = view;

            view = path.join(this.route.controllerName, this.route.action);
        }

        this.res.render(view, model);
    },

    send:function(statusCode,data) {

        if (arguments.length === 1) {
            this.sendOk(arguments[0])
        } else {
            this.res.status(statusCode).jsonp(data);
        }
    },

    sendOk:function(data) {
        this.res.status(200).jsonp(data);
    },

    sendCreated:function(data) {
        this.res.status(201).jsonp(data);
    },

    sendNoContent:function() {
        this.res.status(204).jsonp();
    },

    sendServerError:function(error) {
        this.res.status(500).jsonp({
            status: 500,
            statusText: "Internal Server Error",
            error:error
        });
    },

    sendBadRequest:function(error) {
        this.res.status(400).jsonp({
            status: 400,
            statusText: "Bad Request",
            error:error
        });
    },

    sendUnauthorized:function(error) {
        this.res.status(401).jsonp({
            status: 401,
            statusText: "Unauthorized",
            error:error
        });
    },

    sendNotFound:function(error) {
        this.res.status(404).jsonp({
            status: 404,
            statusText: "Not Found",
            error:error
        });
    },

    json: function (data) {
        deprecate('this.jsonSuccess(data): Use this.json200(data) instead');

        this.res.jsonp(data)
    },

    jsonSuccess: function (data) {
        deprecate('this.jsonSuccess(data): Use this.json200(data) instead');

        this.res.jsonp({
            success: true,
            data: data
        });
    },

    jsonError: function (error) {
        deprecate('this.serverError(error): Use this.json500(error) instead');

        this.res.jsonp({
            success: false,
            message: error
        });
    },

    serverError: function (message) {
        deprecate('this.serverError(message): Use this.json500(message) instead');
        this.res.status(500).send(message);
    },

    serverUnauthorized:function(message){
        deprecate('this.serverUnauthorized(message): Use this.json401(message) instead');
        this.res.status(401).send(message);
    },


    getName: function () {
        return this.route.controller;
    }
});
