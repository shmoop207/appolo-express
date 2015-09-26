"use strict";
var Class = require('appolo').Class,
    appolo = require('appolo'),
    path = require('path'),
    _ = require('lodash'),
    pkg = require('../../package.json'),
    joi = require('joi');

var Router = Class.define({

    constructor: function () {

        this._defaults = {
            controllerSuffix: 'Controller',
            actionSuffix: 'Action'
        }

        this._routes = [];

        Class.addPlugin(function (config, klass, parent) {
            if (config.routes && _.isArray(config.routes)) {

                this.addRoutes(config.id, config.routes);

            }
        }.bind(this));
    },


    initialize: function (app, routes, options) {
        this._app = app;

        this._routes.push.apply(this._routes, routes);

        this._config = _.extend({}, this._defaults, options || {});

        this._app.get('/', function(req, res) {
            res.render(path.resolve(__dirname, '../templates/basicRouteView.html'), {
                version: pkg.version
            });
        });

        _.forEach(this._routes, this._createRoute, this);
    },

    getRoutes: function () {
        return this._routes;
    },

    addRoutes: function (id, routes) {
        var abstract = _.first(_.remove(routes, function (route) {
            return route.abstract
        }));

        _.forEach(routes, function (route) {
            if (!route.controller) {
                route.controller = id
            }

            if (abstract) {
                _.defaults(route, abstract);
            }

            if(route.environments &&
                _.isArray(route.environments) &&
                route.environments.length &&
                !_.contains(route.environments,(appolo.environment.name || appolo.environment.type))){
                return;
            }

            this._routes.push(route)

        }, this);
    },

    _createRoute: function (route) {

        var method = route.method || "get",
            middleware = route.middleware || [];

        if (route.path) {

            if (route.controller.indexOf(this._config.controllerSuffix, route.controller.length - this._config.controllerSuffix.length) === -1) {
                route.controller = route.controller + this._config.controllerSuffix;
            }

            route.controllerName = route.controller.replace(this._config.controllerSuffix, '');


            var args = _.map(middleware, function (middlewareId) {
                if (_.isFunction(middlewareId)) {
                    return middlewareId
                } else {
                    return this._invokeMiddleware.bind(this, route, middlewareId)
                }
            }, this);

            args = args.concat([this._invokeAction.bind(this, route)]);

            if (route.validations) {
                args.unshift(this._checkValidation.bind(this, route));
            }

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
    },

    _checkValidation: function (route, req, res, next) {


        var data = _.extend({}, req.params, req.params, req.query, req.body, req.headers);

        _.defaults(route.validations, {convertToCamelCase: true});

        joi.validate(data, route.validations, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        }, function (err, params) {

            if (err) {
                res.status(400).jsonp({
                    status: 400,
                    statusText: "Bad Request",
                    error: _.reduce(_.groupBy(err.details, 'path'), function (result, errors, key) {
                        result[key] = _.map(errors, 'message');
                        return result;
                    }, {})
                })
            } else {

                var output = {};

                if (route.validations.convertToCamelCase) {
                    _.forEach(params, function (value, key) {
                        output[this._convertSnakeCaseToCamelCase(key)] = value;
                    }, this)
                } else {
                    output = params;
                }

                req.model = output;
                next();
            }
        }.bind(this));
    },

    _convertSnakeCaseToCamelCase: function (str) {
        return str.replace(/(\_\w)/g, function (m) {
            return m[1].toUpperCase();
        });
    },

    reset: function () {
        this._routes.length = 0;
    }
});


module.exports = new Router();
