"use strict";
var appolo = require('appolo'),
    router = require('../routes/router'),
    express = require('express'),
    path = require('path'),
    http = require('http'),
    fs = require('fs'),
    _ = require('lodash'),
    favicon = require('static-favicon'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    consolidate = require('consolidate'),
    flash = require('connect-flash'),
    expressValidator = require('express-validator'),
    multer = require('multer');

var Launcher = appolo.EventDispatcher.define({

    constructor: function () {
        this.cachedRequire = [];
    },

    launch: function (config,callback) {

        this.createServer();

        this.loadOptions(config);

        appolo.launcher.loadEnvironments();

        appolo.launcher.loadFiles();

        if(this._options.loadDefaultConfigurations){
            this.loadConfigurations();
        }

        appolo.launcher.loadInjector();

        this.loadRoutes();

        appolo.launcher.loadBootStrap();

        if(this._options.startServer){
            this.startServer(callback);
        }

        this.fireEvent('appolo-launched');
    },

    createServer: function () {
        this.app = express();

        this.app.server = http.createServer(this.app);

        appolo.inject.addObject('app', this.app);
    },

    loadOptions: function (config) {
        var defaults = {
            templateEngine: 'swig',
            viewsFolder: "/server/views",
            publicFolder: "public",
            startMessage:"",
            startServer:true,
            loadDefaultConfigurations:true
        }

        config = appolo.launcher.loadOptions(config);

        this._options = _.extend(defaults, config || {});
    },

    loadRoutes: function () {
        var routes = [],
            routesPath = path.join(this._options.root, 'config/routes');

        if (!fs.existsSync(routesPath)) {
            return;
        }

        appolo.loader(this._options.root, path.join('config', 'routes'), function (filePath) {

            routes.push.apply(routes, require(filePath));

            this.cachedRequire.push(filePath);
        }.bind(this));

        //load routes
        router.initialize(this.app, routes);
    },

    loadConfigurations: function () {

        var app = this.app;

        app.set('port', process.env.PORT || this._options.port || appolo.environment.port || 8080);

        app.locals.pretty = true;

        app.locals.cache = 'memory';

        app.set('showStackError', true);

        app.use(compression({ level: 9 }));

        app.engine('html', consolidate[this._options.templateEngine]);

        app.set('view engine', 'html');

        app.set('views', path.join(this._options.root, this._options.viewsFolder));

        app.enable('jsonp callback');

        app.use(expressValidator());

        app.use(bodyParser());

        app.use(multer({ dest: './uploads/'}));

        app.use(methodOverride());

        app.use(cookieParser());

        app.use(flash());

        app.use(favicon());

        app.use(express.static(path.join(this._options.root, this._options.publicFolder)));

        if (appolo.environment.type === 'development') {
            app.use(morgan('dev'));
        }


        //this.app.set('views', path.join(this._options.root, this._options.viewsFolder));
        //this.app.set('view engine', this._options.viewsEngine);
        //this.app.use(express.limit('1mb'));
        //this.app.use(express.favicon());

        //this.app.use(express.bodyParser());
        //this.app.use(express.cookieParser());
        //this.app.use(express.methodOverride());
        //this.app.use(express.compress());
        //this.app.enable("jsonp callback");

        //this.app.use(express.logger('dev'));


        appolo.loader(this._options.root, path.join('config', 'express'), function (filePath) {

            this.cachedRequire.push(filePath);

            require(filePath)(this.app);
        }.bind(this));
    },

    startServer: function (callback) {

       this.app.server.listen(this.app.get('port'), this._onServerLoad.bind(this,callback));
    },
    _onServerLoad:function(callback){
        console.log(this._options.startMessage || "Appolo Server listening on port: {0} version:{1} environment: {2}"
            .format(this.app.get('port'),appolo.environment.version,appolo.environment.type));

        callback && callback();

        this.fireEvent('appolo-server-started');
    },
    reset:function(){

        appolo.launcher.reset();

        _.forEach(this.cachedRequire,function(filePath){
            delete require.cache[filePath];
        });

        this.cachedRequire.length = 0;
        this._options = null;

        try{this.app.server.close();} catch(e){console.log("failed to close server",e)}

        process.removeAllListeners();
    }
});

module.exports = new Launcher();