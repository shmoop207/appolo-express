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
    Q = require('bluebird'),
    consolidate = require('consolidate'),
    flash = require('connect-flash'),
    expressValidator = require('express-validator'),
    multer = require('multer');

class Launcher extends appolo.EventDispatcher {

    constructor() {
        super();

        this.cachedRequire = [];
        this._options = {};
    }

    launch(config, callback) {

        var appoloExpress = require("../../index");

        appolo.inject.addObject('appolo', appoloExpress);

        return Q.try(() => this.loadOptions(config))
            .then(() => appolo.launcher.loadEnvironments())
            .then(()=>this._bindProcessEvents())
            .then(()=>this.createServer())
            .then(()=>appolo.launcher.loadModules())
            .then(()=>appolo.launcher.loadFiles())
            .then(()=>appolo.launcher.loadInjector())
            .then(()=>this.setPort())
            .then(()=>this.loadDefaultConfigurations())
            .then(()=>this.loadCustomConfigurations())
            .then(()=>this.loadRoutes())
            .then(()=>appolo.launcher.loadBootStrap())
            .then(()=>this._startServer())
            .then(()=>this._onLaunchSuccess(callback))
            .catch((err)=>this._onLaunchError(callback, err))
    }

    createServer() {
        this.app = express();

        var ssl = this._options.ssl || appolo.environment.ssl;

        if (ssl && ssl.key && ssl.cert) {
            var options = {
                key: fs.readFileSync(ssl.key),
                cert: fs.readFileSync(ssl.cert)
            };

            this.app.server = https.createServer(options, this.app)

        } else {
            this.app.server = http.createServer(this.app);
        }

        appolo.inject.addObject('app', this.app);

        appolo.inject.addObject('router', router);
    }

    loadOptions(config) {
        var defaults = {
            templateEngine: 'swig',
            viewsFolder: "/server/views",
            publicFolder: "public",
            uploadsFolder: "uploads",
            startMessage: "Appolo Server listening on port: {0} version:{1} environment: {2}",
            startServer: true,
            loadDefaultConfigurations: true
        };

        config = appolo.launcher.loadOptions(config);

        this._options = _.extend(defaults, config || {});
    }

    setPort() {
        var app = this.app;

        app.set('port', process.env.PORT || this._options.port || appolo.environment.port || 8080);
    }

    loadDefaultConfigurations() {


        if (!this._options.loadDefaultConfigurations) {
            return
        }

        var app = this.app;

        app.locals.pretty = true;

        app.locals.cache = 'memory';

        app.set('showStackError', true);

        app.use(compression({level: 9}));

        app.engine('html', consolidate[this._options.templateEngine]);

        app.set('view engine', 'html');

        app.set('views', path.join(this._options.root, this._options.viewsFolder));

        app.enable('jsonp callback');

        app.use(expressValidator());

        app.use(bodyParser.urlencoded({
            extended: true
        }));

        if (fs.existsSync(this._options.publicFolder + '/favicon.ico')) {
            app.use(favicon(this._options.publicFolder + '/favicon.ico'));
        }

        app.use(bodyParser.json());

        app.use(multer({dest: path.join(this._options.root, this._options.uploadsFolder)}).array('file'));

        app.use(methodOverride());

        app.use(cookieParser());

        //app.use(flash());

        app.use(express.static(path.join(this._options.root, this._options.publicFolder)));

        if (appolo.environment.type === 'development') {
            app.use(morgan('dev'));
        }
    }

    loadCustomConfigurations() {

        var allPath = path.join(this._options.root, 'config/express/all.js'),
            environmentPath = path.join(this._options.root, 'config/express/', this._options.environment + '.js');

        _.forEach([allPath, environmentPath], (filePath) => {

            if (!fs.existsSync(filePath)) {
                return;
            }

            this.cachedRequire.push(filePath);

            var func = require(filePath);

            var args = _.getFunctionArgs(func);

            var dependencies = _.map(args, (arg) =>  appolo.inject.getObject(arg));

            func.apply(func, dependencies);

        });
    }

    loadRoutes() {
        var routes = [],
            routesPath = path.join(this._options.root, 'config/routes');

        if (fs.existsSync(routesPath)) {
            for (let filePath of appolo.loader.load(this._options.root, path.join('config', 'routes'))) {

                routes.push.apply(routes, require(filePath));

                this.cachedRequire.push(filePath);
            }
        }

        //load routes
        router.initialize(this.app, routes);
    }

    _startServer() {

        if (!this._options.startServer) {
            return
        }

        return this.startServer();
    }


    startServer() {
        return Q.promisify(this.app.server.listen, {context: this.app.server})(this.app.get('port'))
            .then(this._onServerLoad.bind(this));
    }

    _onServerLoad() {

        console.log((this._options.startMessage)
            .format(this.app.get('port'), appolo.environment.version, appolo.environment.type));

        this.fireEvent('appolo-server-started');
    }


    _onLaunchSuccess(callback) {
        callback && callback();

        this.fireEvent('appolo-launched');
    }

    _onLaunchError(callback, err) {

        if (!callback) {
            throw err;
        }

        callback(err);

    }

    _bindProcessEvents() {
        process.on('uncaughtException', function (err) {
            if (err.errno === 'EADDRINUSE') {
                console.error("EADDRINUSE!!!! address in use port: {0}".format(this.app.get('port')))
                process.exit(1);
            }
            else {
                console.error(err.stack || err.toString())
            }

        }.bind(this))
    }


    reset(isSoftReset) {

        appolo.launcher.reset(isSoftReset);

        if (!isSoftReset) {

            _.forEach(this.cachedRequire, (filePath) => delete require.cache[filePath]);

            router.reset();
        }

        this.cachedRequire.length = 0;
        this._options = null;

        try {
            this.app.server.close();
        } catch (e) {
            console.log("failed to close server", e)
        }

        process.removeAllListeners();
    }

    softReset() {
        this.reset(true)
    }
}

module.exports = new Launcher();