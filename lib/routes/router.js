"use strict";
var appolo = require('appolo'),
    _ = require('lodash'),
    Q = require('bluebird'),
    path = require('path'),
    Controller = require('../controller/controller'),
    pkg = require('../../package.json'),
    joi = Q.promisifyAll(require('joi'));

class Router {

    constructor() {

        this._defaults = {
            controllerSuffix: 'Controller',
            actionSuffix: 'Action'
        };

        this._routes = [];

        var fn = function(routes,id,klass,router){
            if(klass === Controller || klass.prototype instanceof  Controller) {

                if (router && _.isArray(routes)) {

                    router.addRoutes(id, routes);
                }

                if (klass.$routes && _.isArray(klass.$routes)) {

                    router.addRoutes(id, klass.$routes);
                }
            }
        }

        appolo.definePlugin((function (router,fn) {
           return  function(config, klass){
               fn(config.routes,config.id,klass,router)
           }

        })(this,fn));

        appolo.Linq.prototype.routes = (function (router,fn) {
            return  function(routes){
                fn(routes,this._id,this._klass,router)
                return this;
            }
        })(this,fn)

    }


    initialize(app, routes, options) {
        this._app = app;

        this._routes.push.apply(this._routes, routes);

        this._config = _.extend({}, this._defaults, options || {});

        //this._app.get('/', function (req, res) {
        //    res.render(path.resolve(__dirname, '../templates/basicRouteView.html'), {
        //        version: pkg.version
        //    });
        //});

        _.forEach(this._routes, this._createRoute, this);
    }

    getRoutes() {
        return this._routes;
    }

    addRoutes(id, routes) {
        var abstract = _.first(_.remove(routes, (route) =>  route.abstract));

        _.forEach(routes,  (route) => {
            if (!route.controller) {
                route.controller = id
            }

            if (abstract) {
                _.defaults(route, abstract);
            }

            if (route.environments &&
                _.isArray(route.environments) &&
                route.environments.length && !_.contains(route.environments, (appolo.environment.name || appolo.environment.type))) {
                return;
            }

            this._routes.push(route)

        });
    }

    _createRoute(route) {

        var method = route.method || "get",
            middleware = route.middleware || [];

        if (route.path) {

            if (route.controller.indexOf(this._config.controllerSuffix, route.controller.length - this._config.controllerSuffix.length) === -1) {
                route.controller = route.controller + this._config.controllerSuffix;
            }

            route.controllerName = route.controller.replace(this._config.controllerSuffix, '');


            var args = _.map(middleware,  (middlewareId) => {
                if (_.isFunction(middlewareId)) {
                    return middlewareId
                } else {
                    return this._invokeMiddleware.bind(this, route, middlewareId)
                }
            });

            args = args.concat([this._invokeAction.bind(this, route)]);

            if (route.validations) {
                args.unshift(this._checkValidation.bind(this, route));
            }

            var expressRoute = this._app.route(route.path);

            expressRoute[method].apply(expressRoute, args);
        }
    }

    _invokeMiddleware(route, middlewareId, req, res, next) {
        var middleware = appolo.inject.getObject(middlewareId, [req, res, next, route]);

        if (!middleware) {
            throw new Error("failed to find middleware " + middlewareId);
        }

        middleware.run(req, res, next, route);
    }

    _invokeAction(route, req, res, next) {


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

    _checkValidation(route, req, res, next) {


        var data = _.extend({}, req.params, req.params, req.query, req.body, req.headers);

        _.defaults(route.validations, {convertToCamelCase: true});

        var options = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        };

        joi.validateAsync(data, route.validations, options)
            .then(this._onValidationSuccess.bind(this,route, req, res, next))
            .catch(this._onValidationError.bind(this,route, req, res, next))
    }

    _onValidationSuccess(route, req, res, next,params) {
        var output = {};

        if (route.validations.convertToCamelCase) {

            _.forEach(params, (value, key) =>  {output[_.convertSnakeCaseToCamelCase(key)] = value });
        }
        else {
            output = params;
        }

        req.model = output;

        next();
    }

    _onValidationError(route, req, res, next,err) {
        res.status(400).jsonp({
            status: 400,
            statusText: "Bad Request",
            error: _.reduce(_.groupBy(err.details, 'path'), (result, errors, key) => {
                result[key] = _.map(errors, 'message');
                return result;
            }, {})
        })
    }

    reset() {
        this._routes.length = 0;
    }
}


module.exports = new Router();