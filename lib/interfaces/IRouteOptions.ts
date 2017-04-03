import appolo = require('appolo');
import    joi = require('joi');
import {Controller} from "./../controller/controller";

export type Method = 'get' | 'post' | 'delete' | 'patch' | 'head' | 'put'

export interface IRouteOptions {
    controller?: string
    controllerName?: string
    action?: Function|string
    environments?: string[]
    roles?: string[]
    middleware?: (string | Function)[]
    validations?: { [index: string]: joi.Schema }
    path?: string
    abstract?: boolean,
    convertToCamelCase?: boolean
    method?: Method
}