"use strict";
import appolo = require('appolo');
import    _ = require('lodash');
import  Q = require('bluebird');
import    path = require('path');
import    {Controller} from '../controller/controller';
import    joi = require('joi');
import    express = require('express');
import {IRouteOptions} from "../interfaces/IRouteOptions";
import {IMiddleware} from "../interfaces/IMiddleware";
import {Util} from "../util/util";


export class Router {

    protected  readonly controllerSuffix:string ='Controller';
    protected  readonly actionSuffix:string ='Action';

    protected _routes:IRouteOptions[];
    protected _app:express.Application;

    constructor() {

        this._routes = [];


        appolo.definePlugin((function (router, fn) {
            return function (config, klass) {
                fn(config.routes, config.id, klass, router)
            }

        })(this, Router.handleRoutes));

    }

    private static handleRoutes(routes, id:string, klass:Function, router:Router){
        if (klass === Controller || klass.prototype instanceof Controller) {

            if (router && _.isArray(routes)) {

                router.addRoutes(id, routes);
            }

            if (router && _.isObject(routes)) {

                router.addRoutes(id, [routes]);
            }

            if ((<any>klass).$routes && _.isArray((<any>klass).$routes)) {

                router.addRoutes(id, (<any>klass).$routes);
            }
        }
    }


    initialize(app:express.Application, routes:IRouteOptions[]) {
        this._app = app;

        this._routes.push.apply(this._routes, routes);

        _.forEach(this._routes, (route)=>this._createRoute(route));
    }

    public getRoutes():IRouteOptions[] {
        return this._routes;
    }

    public addRoutes(id:string, routes:IRouteOptions[]) {
        let abstract =  _(routes).remove(route=> route.abstract).first();

        _.forEach(routes, (route) => {
            if (!route.controller) {
                route.controller = id
            }

            if (abstract) {
                _.defaults(route, abstract);
            }


            this._routes.push(route)

        });
    }

    protected _createRoute(route:IRouteOptions) {

        let method = route.method || "get",
            middleware = route.middleware || [];

        if (route.environments &&
            _.isArray(route.environments) &&
            route.environments.length && !_.includes(route.environments, (appolo.environment.name || appolo.environment.type))) {
            return;
        }

        if (!route.path) {
            return
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

    protected _invokeMiddleware(route:IRouteOptions, middlewareId:string, req:express.Request, res:express.Response, next:express.NextFunction) {
        let middleware = appolo.inject.getObject<IMiddleware>(middlewareId, [req, res, next, route]);

        if (!middleware) {
            throw new Error("failed to find middleware " + middlewareId);
        }

        middleware.run(req, res, next, route);
    }

    protected _invokeAction(route:IRouteOptions, req:express.Request, res:express.Response, next:express.NextFunction) {


        let controller = appolo.inject.getObject<Controller>(route.controller, [req, res, next, route]);

        if (!controller) {
            throw new Error("failed to find controller " + route.controller);
        }

        controller.initialize();

        controller.invoke(route.action);
    }

   protected async _checkValidation(route:IRouteOptions, req:express.Request, res:express.Response, next:express.NextFunction) {


       let data = _.extend({}, req.params, req.query, req.body);

       let options = {
           abortEarly: false,
           allowUnknown: true,
           stripUnknown: true
       };

       try {
           let params = await Q.fromCallback((callback) => joi.validate(data, route.validations, options, callback));

           let output = {};

           if (route.convertToCamelCase!==false) {

               for(let key in params){
                   output[Util.convertSnakeCaseToCamelCase(key)] = params[key]
               }
           }
           else {
               output = params;
           }

           (req as any).model = output;

           next();

       } catch (e) {
           res.status(400).jsonp({
               status: 400,
               statusText: "Bad Request",
               error: _.reduce(_.groupBy(e.details, 'path'), (result, errors, key) => {
                   result[key] = _.map(errors, 'message');
                   return result;
               }, {})
           })
       }
   }

    public reset() {
        this._routes.length = 0;
    }
}


export default new Router();