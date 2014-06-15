"use strict";
var Class = require('appolo').Class,
    appolo = require('appolo'),
    _ = require('lodash');

var Router = Class.define({

    constructor: function () {

        this._defaults = {
            controllerSuffix: 'Controller',
            actionSuffix: 'Action'
        }

        this._routes = [];

        Class.addPlugin(function (config, klass, parent) {
            if (config.routes && _.isArray(config.routes)) {

                _.forEach(config.routes,function(route){
                    if(!route.controller){
                        route.controller = config.id
                    }

                    this._routes.push(route)

                },this);
            }
        }.bind(this));
    },

    initialize: function (app, routes, options) {
        this._app = app;

        this._routes.push.apply(this._routes, routes);

        this._config = _.extend({}, this._defaults, options || {});

        _.forEach(this._routes, this._createRoute, this);
    },

    _createRoute: function (route) {

        var method = route.method || "get",
            middleware = route.middleware || [];

        if (route.path) {

            if (route.controller.indexOf(this._config.controllerSuffix, route.controller.length - this._config.controllerSuffix.length) === -1) {
                route.controller += this._config.controllerSuffix;
            }

            var args = _.map(middleware, function (middlewareId) {
                if (_.isFunction(middlewareId)) {
                    return middlewareId
                } else {
                    return this._invokeMiddleware.bind(this, route, middlewareId)
                }
            }, this);

            args = args.concat([this._invokeAction.bind(this, route)]);

            var expressRoute = this._app.route(route.path);

            expressRoute[method].apply(expressRoute, args);
        }
    },

    _invokeMiddleware: function (route, middlewareId, req, res, next) {
        var middleware = appolo.inject.getObject(middlewareId, [req, res, next, route]);

        if (!middleware) {
            throw new Error("failed to find middleware " + middlewareId);
        }

        middleware.run(req, res, next, route);
    },

    _invokeAction: function (route, req, res, next) {


        var controller = appolo.inject.getObject(route.controller, [req, res, next, route]);

        if (!controller) {
            throw new Error("failed to find controller " + route.controller);
        }

        if (route.locals) {
            _.extend(res.locals, route.locals);
        }

        controller.initialize();

        controller.invoke(route.action);
    }
});


module.exports = new Router();