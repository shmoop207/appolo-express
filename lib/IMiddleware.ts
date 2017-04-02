import appolo = require('appolo');
import    express = require('express');
import {IRouteOptions} from "./IRouteOptions";


export interface IMiddleware{
 run(req:express.Request, res:express.Response, next:express.NextFunction,route:IRouteOptions)
}
