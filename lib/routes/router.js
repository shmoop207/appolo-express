"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("appolo");
const _ = require("lodash");
const Q = require("bluebird");
const controller_1 = require("../controller/controller");
const joi = require("joi");
const util_1 = require("../util/util");
class Router {
    constructor() {
        this.controllerSuffix = 'Controller';
        this.actionSuffix = 'Action';
        this._routes = [];
        appolo.definePlugin((function (router, fn) {
            return function (config, klass) {
                fn(config.routes, config.id, klass, router);
            };
        })(this, Router.handleRoutes));
    }
    static handleRoutes(routes, id, klass, router) {
        if (klass === controller_1.Controller || klass.prototype instanceof controller_1.Controller) {
            if (router && _.isArray(routes)) {
                router.addRoutes(id, routes);
            }
            if (router && _.isObject(routes)) {
                router.addRoutes(id, [routes]);
            }
            if (klass.$routes && _.isArray(klass.$routes)) {
                router.addRoutes(id, klass.$routes);
            }
        }
    }
    initialize(app, routes) {
        this._app = app;
        this._routes.push.apply(this._routes, routes);
        for (let i = 0, length = this._routes ? this._routes.length : 0; i < length; i++) {
            this._createRoute(this._routes[i]);
        }
    }
    getRoutes() {
        return this._routes;
    }
    addRoutes(id, routes) {
        let abstract = _(routes).remove(route => route.abstract).first();
        for (let i = 0, length = routes ? routes.length : 0; i < length; i++) {
            let route = routes[i];
            if (!route.controller) {
                route.controller = id;
            }
            if (abstract) {
                _.defaults(route, abstract);
            }
            this._routes.push(route);
        }
    }
    _createRoute(route) {
        let method = route.method || "get", middleware = route.middleware || [];
        if (route.environments &&
            _.isArray(route.environments) &&
            route.environments.length && !_.includes(route.environments, (appolo.environment.name || appolo.environment.type))) {
            return;
        }
        if (!route.path) {
            return;
        }
        if (route.controller.indexOf(this.controllerSuffix, route.controller.length - this.controllerSuffix.length) === -1) {
            route.controller = route.controller + this.controllerSuffix;
        }
        route.controllerName = route.controller.replace(this.controllerSuffix, '');
        let args = _.map(middleware, middlewareId => _.isFunction(middlewareId)
            ? middlewareId
            : this._invokeMiddleware.bind(this, route, middlewareId));
        args = args.concat([this._invokeAction.bind(this, route)]);
        if (!_.isEmpty(route.validations)) {
            args.unshift(this._checkValidation.bind(this, route));
        }
        let expressRoute = this._app.route(route.path);
        expressRoute[method].apply(expressRoute, args);
    }
    _invokeMiddleware(route, middlewareId, req, res, next) {
        let middleware = appolo.inject.getObject(middlewareId, [req, res, next, route]);
        if (!middleware) {
            throw new Error("failed to find middleware " + middlewareId);
        }
        middleware.run(req, res, next, route);
    }
    _invokeAction(route, req, res, next) {
        let controller = appolo.inject.getObject(route.controller, [req, res, next, route]);
        if (!controller) {
            throw new Error("failed to find controller " + route.controller);
        }
        controller.initialize();
        controller.invoke(route.action);
    }
    _checkValidation(route, req, res, next) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = _.extend({}, req.params, req.query, req.body);
            let options = {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true
            };
            try {
                let params = yield Q.fromCallback((callback) => joi.validate(data, route.validations, options, callback));
                let output = {};
                if (route.convertToCamelCase !== false) {
                    for (let key in params) {
                        output[util_1.Util.convertSnakeCaseToCamelCase(key)] = params[key];
                    }
                }
                else {
                    output = params;
                }
                req.model = output;
                next();
            }
            catch (e) {
                res.status(400).jsonp({
                    status: 400,
                    statusText: "Bad Request",
                    error: _.reduce(_.groupBy(e.details, 'path'), (result, errors, key) => {
                        result[key] = _.map(errors, 'message');
                        return result;
                    }, {})
                });
            }
        });
    }
    reset() {
        this._routes.length = 0;
    }
}
exports.Router = Router;
exports.default = new Router();
//# sourceMappingURL=router.js.map