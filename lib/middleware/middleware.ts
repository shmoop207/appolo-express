"use strict";

import path = require('path');
import _= require('lodash');
import    express = require('express');
import {IRouteOptions} from "../interfaces/IRouteOptions";
import {IMiddleware} from "../interfaces/IMiddleware";


export class Middleware implements IMiddleware{

    protected req :express.Request;
    protected res :express.Response;
    protected next : express.NextFunction;
    protected route :IRouteOptions;

    constructor (req:express.Request, res:express.Response, next:express.NextFunction, route:IRouteOptions) {

        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    }

    public run (req:express.Request, res:express.Response, next:express.NextFunction, route:IRouteOptions) {

        next();

    }

    public sendServerError(error?,code?) {
        this.res.status(500).jsonp({
            status: 500,
            statusText: "Internal Server Error",
            error:error,
            code:code
        });
    }

    public sendBadRequest(error?,code?) {
        this.res.status(400).jsonp({
            status: 400,
            statusText: "Bad Request",
            error:error,
            code:code
        });
    }

    public sendUnauthorized(error?,code?) {
        this.res.status(401).jsonp({
            status: 401,
            statusText: "Unauthorized",
            error:error,
            code:code
        });
    }

    public sendNotFound(error?,code?) {
        this.res.status(404).jsonp({
            status: 404,
            statusText: "Not Found",
            error:error,
            code:code
        });
    }
}
