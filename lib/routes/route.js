"use strict";
var appolo = require('appolo'),
    _ = require('lodash'),
    router = require('./router');

class Route {
    constructor(controller) {

        this._route = {
            controller: _.isFunction(controller) && controller.name ? controller.name : controller,
            validations: {},
            middleware: [],
            environments: [],
            roles:[]
        };

        router.getRoutes().push(this._route);
    }

    path(pathPattern) {

        this._route.path = pathPattern;

        return this;
    }

    action(action) {

        this._route.action = action;

        return this;
    }

    abstract(abstract){
        _.extend(this._route,_.cloneDeep(abstract));

        return this;
    }

    validation(key, validation){
        return this.validations(key, validation);
    }

    validations(key, validation) {

        if (_.isObject(key)) {

            _.extend(this._route.validations, key)

        } else {

            this._route.validations[key] = validation
        }

        return this;
    }

    method(method) {

        this._route.method = method;

        return this;
    }

    environment(environment){
        return this.environments(environment)
    }

    environments(environment) {
        if (_.isArray(environment)) {

            this._route.environments.push.apply(this._route.environments, environment);
        }
        else {

            this._route.environments.push(environment)
        }

        return this;
    }

    middleware(middleware){
        return this.middlewares(middleware)
    }

    middlewares(middleware) {

        if (_.isArray(middleware)) {

            this._route.middleware.push.apply(this._route.middleware, middleware);

        } else {

            this._route.middleware.push(middleware)
        }

        return this;
    }

    role(role){
        return this.roles(role)
    }

    roles(role) {

        if (_.isArray(role)) {

            this._route.roles.push.apply(this._route.roles, role);

        } else {

            this._route.roles.push(role)
        }

        return this;
    }

    route(controller){
        return new Route(controller || this._route.controller);
    }
}

module.exports = function(controller){
    return new Route(controller)
}