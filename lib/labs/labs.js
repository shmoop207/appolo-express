//    var callFilters = function (filters, action) {
//        var i = 0,
//            filter,
//            success = true;
//
//        //combine all filters with action filters
//        filters = (filters['*'] || []).concat((filters[action] || []));
//
//        if (filters.length > 0) {
//            (function iterator(err) {
//
//                if (err) {
//                    success = false;
//                    return;
//                }
//
//                //get the next filter
//                filter = filters[i++];
//
//                //if we have a filter call it else we finished runnig the filter return success
//                if (filter) {
//                    filter.call(_self, _self.req, _self.res, iterator);
//                }
//            })();
//        }
//
//        return success;
//    };


//    function addFilter (filters, actions, callback) {
//
//        actions = _.isArray(actions) ?  actions : [actions];
//
//        _.forEach(actions,function(action){
//            if (!filters[action]) {
//                filters[action]  = [];
//            }
//
//            filters[action].push(callback);
//        });
//
//    };

//    this.beforeAction = function (action, callback) {
//
//        addFilter(_beforeAction, action, callback);
//    };
//
//    this.afterAction = function (action, callback) {
//
//        addFilter(_afterAction, action, callback);
//    };




//"use strict";
//var appolo = require('appolo'),
//    Class = require('appolo-class'),
//    express = require('express'),
//    http = require('http'),
//    path = require('path'),
//    fs = require('fs'),
//    _ = require('lodash'),
//    i18n = require("i18n");
//
//var Launcher = Class.define({
//
//    constructor: function () {
//
//
//    },
//
//    launch: function (config) {
//        this._options = config || {};
//
//        this._options.root = this._options.root || process.cwd();
//
//        this._options.environment = this._options.environment || (process.env.NODE_ENV || 'development');
//
//        this._createServer();
//
//        this._loadEnvironments();
//
//        //load files
//        appolo.loader.loadFiles(['config', 'server'], this._options.root);
//
//        //load env files
//        appolo.loader.loadFiles(appolo.environment.paths, this._options.root);
//
//        //load server configurations
//        this._loadConfigurations();
//
//        //load routes
//        this._loadRoutes();
//
//        this._loadLocales();
//
//        this._loadInjector();
//
//        this._statServer();
//    },
//    _createServer: function () {
//
//        // Create express;
//        this._app = express();
//
//        // Create an http server
//        this._app.server = http.createServer(this._app);
//    },
//    _loadEnvironments: function () {
//        var all = require(path.join(this._options.root, 'config/environments/all')),
//            environment = require(path.join(this._options.root, 'config/environments/', this._options.environment + '.js'));
//
//        //add current env config to appolo env
//        _.extend(appolo.environment, all, environment || {});
//
//        //save evn name
//        appolo.environment.type = this._options.environment;
//
//        //add root
//        appolo.environment.rootDir = this._options.root;
//
//        appolo.inject.addObject('environment', appolo.environment);
//        appolo.inject.addObject('env', appolo.environment);
//    },
//    _loadConfigurations: function () {
//
//        this._app.configure("all", function () {
//
//            this._app.set('port', (process.env.PORT || appolo.environment.port) || 8080);
//            this._app.set('views', this._options.root + '/server/views');
//            this._app.set('view engine', 'jade');
//            this._app.use(express.limit('1mb'));
//            this._app.use(express.favicon());
//            this._app.use(express.logger('dev'));
//            this._app.use(express.bodyParser());
//            this._app.use(express.cookieParser());
//            this._app.use(i18n.init);
//            this._app.use(express.methodOverride());
//            this._app.use(express.compress());
//
//            this._app.enable("jsonp callback");
//
//            this._app.use(express.static(path.join(this._options.root, 'public')));
//        }.bind(this));
//
//
//        fs.readdirSync(path.join(this._options.root, 'config/express')).forEach(function (file) {
//            require(path.join(this._options.root, 'config', 'express', file))(this._app);
//        }.bind(this));
//
////        this._app.configure("all", function () {
////            this._app.use(this._app.router);
////        }.bind(this));
//    },
//
//    _loadRoutes: function () {
//        var routes = [],
//            routesPath = path.join(this._options.root, 'config/routes');
//
//        if (!fs.existsSync(routesPath)) {
//            return;
//        }
//
//        fs.readdirSync(routesPath).forEach(function (file) {
//            routes.push.apply(routes, require(path.join(this._options.root, 'config', 'routes', file)));
//        }.bind(this));
//
//        //load routes
//        appolo.router.initialize(this._app, routes);
//    },
//    _loadLocales: function () {
//        i18n.configure({
//            locales: ['en', 'he'],
//            defaultLocale: 'en',
//            cookie: 'appolo-lang',
//            directory: path.join(this._options.root, 'config/locales')
//        });
//    },
//    _loadInjector: function () {
//        var definitions = {};
//
//        fs.readdirSync(path.join(this._options.root, 'config/inject')).forEach(function (file) {
//            _.extend(definitions, require(path.join(this._options.root, 'config', 'inject', file)));
//        }.bind(this));
//
//        appolo.inject.addObject('app', this._app);
//
//        //load inject
//        appolo.inject.initialize({
//            definitions: definitions,
//            root: this._options.root
//        });
//    },
//    _statServer: function () {
//        this._app.server.listen(this._app.get('port'), function () {
//            console.log("Express server listening on port: " + this._app.get('port') + ' version: ' + appolo.environment.version);
//        }.bind(this));
//    }
//
//
//
//});
//
//
//module.exports = new Launcher();
