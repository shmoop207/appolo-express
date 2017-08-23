"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const _ = require("lodash");
class Controller {
    constructor(req, res, next, route) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    }
    initialize() {
    }
    invoke(action) {
        let fnName = this.route._actionFnName;
        if (!fnName) {
            fnName = _.isString(action) ? action : action(this).name;
            if (!this[fnName]) {
                throw new Error(`failed to invoke ${this.constructor.name} fnName ${fnName}`);
            }
            this.route._actionFnName = fnName;
        }
        this.action = action;
        this[fnName](this.req, this.res, this.next);
    }
    render(view, model) {
        if (!model) {
            model = view;
            view = path.join(this.route.controllerName, _.isString(this.route.action) ? this.route.action : this.route.action.name);
        }
        this.res.render(view, model);
    }
    send(statusCode, data) {
        if (arguments.length === 1) {
            this.sendOk(arguments[0]);
        }
        else {
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
    sendServerError(error, code) {
        this.res.status(500).jsonp({
            status: 500,
            statusText: "Internal Server Error",
            error: error ? error.toString() : "",
            code: code
        });
    }
    sendBadRequest(error, code) {
        this.res.status(400).jsonp({
            status: 400,
            statusText: "Bad Request",
            error: (error instanceof Error) ? error.toString() : "",
            code: code
        });
    }
    sendUnauthorized(error, code) {
        this.res.status(401).jsonp({
            status: 401,
            statusText: "Unauthorized",
            error: error ? error.toString() : "",
            code: code
        });
    }
    sendNotFound(error, code) {
        this.res.status(404).jsonp({
            status: 404,
            statusText: "Not Found",
            error: error ? error.toString() : "",
            code: code
        });
    }
    getName() {
        return this.route.controller;
    }
    getModel() {
        return this.req.model;
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map