"use strict";
import appolo = require('appolo');
import    _ = require('lodash');
import    joi = require('joi');
import    router  from './router';
import {Controller} from "../controller/controller";
import {IRouteOptions} from "../interfaces/IRouteOptions";

export class Route<T> {
    protected _route:IRouteOptions;

    constructor(controller: string | typeof Controller) {

        this._route = <Partial<IRouteOptions>>{
            controller: _.isFunction(controller) && controller.name ? _.camelCase(controller.name) : controller,
            validations: {},
            middleware: [],
            environments: [],
            roles:[],
            path:"",
            action:null
        };

        router.getRoutes().push(this._route);
    }

    public path(pathPattern:string):this {

        this._route.path = pathPattern;

        return this;
    }

    public action(action: ((c: T) => Function)|string): this{

        this._route.action = action;

        return this;
    }

    public abstract(abstract:Partial<IRouteOptions>):this{
        _.extend(this._route,_.cloneDeep(abstract));

        return this;
    }

    public validation(key:string|{[index:string]:joi.Schema}, validation?:joi.Schema):this{
        return this.validations(key, validation);
    }

    public validations(key:string|{[index:string]:joi.Schema}, validation?:joi.Schema):this {

        if (_.isObject(key)) {

            _.extend(this._route.validations, key)

        } else {

            this._route.validations[key as string] = validation
        }

        return this;
    }

    public method(method:'get' | 'post' | 'delete' | 'patch' | 'head' | 'put'):this {

        this._route.method = method;

        return this;
    }

    public environment(environment:string|string[]):this{
        return this.environments(environment)
    }

    public environments(environment:string|string[]):this {
        if (_.isArray(environment)) {

            this._route.environments.push.apply(this._route.environments, environment);
        }
        else {

            this._route.environments.push(environment)
        }

        return this;
    }

    public middleware(middleware: string | string[] | Function| Function[]):this{
        return this.middlewares(middleware)
    }

    public middlewares(middleware: string | string[] |Function |Function[]):this {

        if (_.isArray(middleware)) {

            this._route.middleware.push.apply(this._route.middleware, middleware);

        } else {

            this._route.middleware.push(middleware)
        }

        return this;
    }

    public role(role:string|string[]):this{
        return this.roles(role)
    }

    public roles(role:string|string[]):this {

        if (_.isArray(role)) {

            this._route.roles.push.apply(this._route.roles, role);

        } else {

            this._route.roles.push(role)
        }

        return this;
    }

    route<T>(controller:string | typeof Controller):Route<T>{
        return new Route<T>(controller || this._route.controller);
    }
}

export default   function<T>(controller: string | typeof Controller):Route<T>{
    return new Route<T>(controller)
}