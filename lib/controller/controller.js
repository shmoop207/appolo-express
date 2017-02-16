"use strict";

var path = require('path'),
    _ = require('lodash'),
    deprecate = require('depd')('appolo-express');

module.exports = class Controller{

    constructor (req, res, next, route) {

        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    }

    initialize () {

    }

    invoke (action) {

        var fn = _.isString(action) ?  this[action] : action(this);

        if (typeof fn !== 'function') {
            throw new Error(this.route.controller + ' ' + action + ' is not a function');
        }

        this.action = action;

        fn.call(this,this.req, this.res, this.next);

    }

    render (view, model) {
        if (!model) {
            model = view;

            view = path.join(this.route.controllerName, this.route.action);
        }

        this.res.render(view, model);
    }

    send(statusCode,data) {

        if (arguments.length === 1) {
            this.sendOk(arguments[0])
        } else {
            this.res.status(statusCode).jsonp(data);
        }
    }

    sendOk(data) {
        this.res.status(200).jsonp(data);
    }

    sendCreated(data) {
        this.res.status(201).jsonp(data);
    }

    sendNoContent() {
        this.res.status(204).jsonp();
    }

    sendServerError(error,code) {
        this.res.status(500).jsonp({
            status: 500,
            statusText: "Internal Server Error",
            error:error ? error.toString():"" ,
            code:code
        });
    }

    sendBadRequest(error,code) {
        this.res.status(400).jsonp({
            status: 400,
            statusText: "Bad Request",
            error:(error instanceof Error) ? error.toString():"" ,
            code:code
        });
    }

    sendUnauthorized(error,code) {
        this.res.status(401).jsonp({
            status: 401,
            statusText: "Unauthorized",
            error:error ? error.toString():"" ,
            code:code
        });
    }

    sendNotFound(error,code) {
        this.res.status(404).jsonp({
            status: 404,
            statusText: "Not Found",
            error:error ? error.toString():"" ,
            code:code
        });
    }

    json (data) {
        deprecate('this.jsonSuccess(data): Use this.json200(data) instead');

        this.res.jsonp(data)
    }

    jsonSuccess (data) {
        deprecate('this.jsonSuccess(data): Use this.json200(data) instead');

        this.res.jsonp({
            success: true,
            data: data
        });
    }

    jsonError (error) {
        deprecate('this.serverError(error): Use this.json500(error) instead');

        this.res.jsonp({
            success: false,
            message: error
        });
    }

    serverError (message) {
        deprecate('this.serverError(message): Use this.json500(message) instead');
        this.res.status(500).send(message);
    }

    serverUnauthorized(message){
        deprecate('this.serverUnauthorized(message): Use this.json401(message) instead');
        this.res.status(401).send(message);
    }


    getName () {
        return this.route.controller;
    }
    getModel(){
        return this.req.model;
    }
}
