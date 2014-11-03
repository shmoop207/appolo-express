"use strict";
var appolo = require('appolo'),
    router = require('../routes/router'),
    express = require('express'),
    path = require('path'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    _ = appolo._,
    favicon = require('serve-favicon'),
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

    launch: function (config, callback) {

        this._bindProcessEvents();

        var appoloExpress = require("../../index");

        appolo.inject.addObject('appolo', appoloExpress);

        this.loadOptions(config);

        appolo.launcher.loadEnvironments();

        this.createServer();

        appolo.launcher.loadFiles();



        appolo.module.initialize(this._onModuleInitialize.bind(this,callback))
    },

    _bindProcessEvents:function(){
        process.on('uncaughtException', function(err) {
            if(err.errno === 'EADDRINUSE') {
                console.error("EADDRINUSE!!!! address in use port: {0}".format(this.app.get('port')) )
                process.exit(1);
            }
            else {
                console.error(err.stack || err.toString())
            }




        }.bind(this))
    },

    _onModuleInitialize: function (callback,err, results) {

        if(err) {
            if(callback){
                return callback(err)
            } else {
                throw err;
            }
        }

        appolo.launcher.loadInjector();

        if (this._options.loadDefaultConfigurations) {
            this.loadConfigurations();
        }

        this.loadRoutes();

        appolo.launcher.loadBootStrap(this._onBootstrapInitialize.bind(this,callback))

    },

    _onBootstrapInitialize: function (callback,err) {

        if(err) {
            if(callback){
                return callback(err);
            } else {
                throw err;
            }
        }


        if (this._options.startServer) {
            this.startServer(callback);
        } else {
            callback && callback();
        }

        this.fireEvent('appolo-launched');
    },

    createServer: function () {
        this.app = express();

        var ssl = this._options.ssl || appolo.environment.ssl;

        if(ssl && ssl.key && ssl.cert){
            var options = {
                key: fs.readFileSync(ssl.key),
                cert: fs.readFileSync(ssl.cert)
            };

            this.app.server = https.createServer(options,this.app)

        } else {
            this.app.server = http.createServer(this.app);
        }

        appolo.inject.addObject('app', this.app);

        appolo.inject.addObject('router', router);
    },

    loadOptions: function (config) {
        var defaults = {
            templateEngine: 'swig',
            viewsFolder: "/server/views",
            publicFolder: "public",
            startMessage: "",
            startServer: true,
            loadDefaultConfigurations: true
        }

        config = appolo.launcher.loadOptions(config);

        this._options = _.extend(defaults, config || {});
    },

    loadRoutes: function () {
        var routes = [],
            routesPath = path.join(this._options.root, 'config/routes');

        if (fs.existsSync(routesPath)) {
            appolo.loader.load(this._options.root, path.join('config', 'routes'), function (filePath) {

                routes.push.apply(routes, require(filePath));

                this.cachedRequire.push(filePath);
            }.bind(this));
        }

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

        app.use(bodyParser.urlencoded({
            extended: true
        }));

        if (fs.existsSync(this._options.publicFolder+'/favicon.ico')) {
            app.use(favicon(this._options.publicFolder+'/favicon.ico'));
        }



        app.use(bodyParser.json())

        app.use(multer({ dest: './uploads/'}));

        app.use(methodOverride());

        app.use(cookieParser());

        app.use(flash());

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


        appolo.loader.load(this._options.root, path.join('config', 'express'), function (filePath) {

            this.cachedRequire.push(filePath);

            var func =  require(filePath)

            var args = _.getFunctionArgs(func);

            var dependencies = _.map(args,function(arg){
                return appolo.inject.getObject(arg);
            });

            func.apply(func,dependencies );

        }.bind(this));
    },



    startServer: function (callback) {


            this.app.server.listen(this.app.get('port'), this._onServerLoad.bind(this, callback));


    },
    _onServerLoad: function (callback) {

        console.log((this._options.startMessage || "Appolo Server listening on port: {0} version:{1} environment: {2}")
            .format(this.app.get('port'), appolo.environment.version, appolo.environment.type));

        callback && callback();

        this.fireEvent('appolo-server-started');
    },
    reset: function () {

        appolo.launcher.reset();

        _.forEach(this.cachedRequire, function (filePath) {
            delete require.cache[filePath];
        });

        router.reset();

        this.cachedRequire.length = 0;
        this._options = null;

        try {
            this.app.server.close();
        } catch (e) {
            console.log("failed to close server", e)
        }

        process.removeAllListeners();
    }
});

module.exports = new Launcher();