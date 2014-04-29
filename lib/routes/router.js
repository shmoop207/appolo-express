"use strict";
var Class = require('appolo').Class,
    appolo = require('appolo'),
    _ = require('lodash');

 var Router= Class.define({

    constructor: function () {

        this._defaults = {
            controllerSuffix: 'Controller',
            actionSuffix: 'Action'
        }
    },

    initialize: function (app,routes,options) {
        this._app = app;

        this._routes = routes;

        this._config = _.extend({}, this._defaults, options || {});

        _.forEach(this._routes,this._createRoute,this);
    },

     _createRoute: function (route) {

         var method = route.method || "get",
             middleware = route.middleware || [];

         if (route.path) {

             var args = middleware.concat([this._invokeAction.bind(this, route)]);

             var expressRoute = this._app.route(route.path);

             expressRoute[method].apply(expressRoute, args);
         }
     },

     _invokeAction: function (route, req, res, next) {

         var controller = appolo.inject.getObject(route.controller + this._config.controllerSuffix, [req, res, next, route.controller]);

         if (!controller) {
             throw new Error("failed to find controller " + route.controller);
         }

         if (route.locals) {
             _.extend(res.locals, route.locals);
         }

         controller.initialize();

         controller.invoke(route.action);
     }
});


module.exports = new Router();