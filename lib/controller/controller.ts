"use strict";

import path = require('path');
import    _ = require('lodash');
import    express = require('express');
import {IRouteOptions} from "../interfaces/IRouteOptions";

export class Controller{

    protected req :express.Request;
    protected res :express.Response;
    protected next : express.NextFunction;
    protected route :IRouteOptions;
    protected action:string|Function;

    constructor (req:express.Request, res:express.Response, next:express.NextFunction, route:IRouteOptions) {

        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;

    }

    public initialize () {

    }

    public invoke (action:string|Function) {

        let fn = _.isString(action) ?  this[action] : action(this);

        if (typeof fn !== 'function') {
            throw new Error(this.route.controller + ' ' + action + ' is not a function');
        }

        this.action = action;

        fn.call(this,this.req, this.res, this.next);

    }

    public render (view?, model?) {
        if (!model) {
            model = view;

            view = path.join(this.route.controllerName, _.isString(this.route.action)?this.route.action : this.route.action.name);
        }

        this.res.render(view, model);
    }

    public send(statusCode?,data?) {

        if (arguments.length === 1) {
            this.sendOk(arguments[0])
        } else {
            this.res.status(statusCode).jsonp(data);
        }
    }

    public sendOk(data?:any) {
        this.res.status(200).jsonp(data);
    }

    public sendCreated(data?:any) {
        this.res.status(201).jsonp(data);
    }

    public sendNoContent() {
        this.res.status(204).jsonp();
    }

    public sendServerError(error?,code?) {
        this.res.status(500).jsonp({
            status: 500,
            statusText: "Internal Server Error",
            error:error ? error.toString():"" ,
            code:code
        });
    }

    public sendBadRequest(error?,code?) {
        this.res.status(400).jsonp({
            status: 400,
            statusText: "Bad Request",
            error:(error instanceof Error) ? error.toString():"" ,
            code:code
        });
    }

    public sendUnauthorized(error?,code?) {
        this.res.status(401).jsonp({
            status: 401,
            statusText: "Unauthorized",
            error:error ? error.toString():"" ,
            code:code
        });
    }

    public sendNotFound(error?,code?) {
        this.res.status(404).jsonp({
            status: 404,
            statusText: "Not Found",
            error:error ? error.toString():"" ,
            code:code
        });
    }


   public getName ():string {
        return this.route.controller;
    }
    public getModel<T>():T{
        return (this.req as any).model;
    }
}
