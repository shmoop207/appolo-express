"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("appolo");
const router_1 = require("../routes/router");
const express = require("express");
const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");
const favicon = require("serve-favicon");
const morgan = require("morgan");
const compression = require("compression");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const Q = require("bluebird");
const _ = require("lodash");
const consolidate = require("consolidate");
const multer = require("multer");
const errorhandler = require("errorhandler");
class Launcher extends appolo.Launcher {
    launch(config, callback) {
        const _super = name => super[name];
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                appolo.inject.addObject('appolo', require("../../index"));
                this._options = this.loadOptions(config);
                _super("loadEnvironments").call(this);
                this.createServer();
                this.bindProcessEvents();
                yield _super("loadModules").call(this);
                _super("loadFiles").call(this);
                _super("loadInjector").call(this);
                this.setPort();
                this.loadDefaultConfigurations();
                this.loadCustomConfigurations();
                this.loadRoutes();
                yield _super("loadBootStrap").call(this);
                this._startServer();
                callback && callback();
                this.fireEvent('appolo-launched');
            }
            catch (e) {
                if (!callback) {
                    throw e;
                }
                callback(e);
            }
        });
    }
    loadOptions(config) {
        let defaults = {
            templateEngine: 'swig',
            viewsFolder: "/server/views",
            publicFolder: "public",
            uploadsFolder: "uploads",
            startMessage: "Appolo Server listening on port: ${port} version:${version} environment: ${environment}",
            startServer: true,
            loadDefaultConfigurations: true,
            useBodyParser: true,
            useMulter: true
        };
        let dto = super.loadOptions(config);
        return _.extend(defaults, dto || {});
    }
    bindProcessEvents() {
        process.on('uncaughtException', function (err) {
            if (err.errno === 'EADDRINUSE') {
                console.error(`EADDRINUSE!!!! address in use port: ${this.app.get('port')}`);
                process.exit(1);
            }
            else {
                console.error(err.stack || err.toString());
            }
        }.bind(this));
    }
    createServer() {
        this._app = express();
        let server;
        let ssl = this._options.ssl || appolo.environment.ssl;
        if (ssl && ssl.key && ssl.cert) {
            let options = {
                key: fs.readFileSync(ssl.key),
                cert: fs.readFileSync(ssl.cert)
            };
            server = https.createServer(options, this._app);
        }
        else {
            server = http.createServer(this._app);
        }
        this._server = server;
        appolo.inject.addObject('app', this._app);
        appolo.inject.addObject('router', router_1.default);
    }
    setPort() {
        this._port = process.env.APP_PORT || process.env.PORT || this._options.port || appolo.environment.port || 8080;
        this._app.set('port', this._port);
    }
    loadDefaultConfigurations() {
        if (!this._options.loadDefaultConfigurations) {
            return;
        }
        this._app.locals.pretty = true;
        this._app.locals.cache = 'memory';
        this._app.use(compression({ level: 9 }));
        this._app.engine('html', consolidate[this._options.templateEngine]);
        this._app.set('view engine', 'html');
        this._app.set('views', path.join(this._options.root, this._options.viewsFolder));
        this._app.enable('jsonp callback');
        if (fs.existsSync(this._options.publicFolder + '/favicon.ico')) {
            this._app.use(favicon(this._options.publicFolder + '/favicon.ico'));
        }
        if (this._options.useBodyParser) {
            this._app.use(bodyParser.urlencoded({
                extended: true
            }));
            this._app.use(bodyParser.json());
        }
        if (this._options.useMulter) {
            this._app.use(multer({ dest: path.join(this._options.root, this._options.uploadsFolder) }).array('file'));
        }
        this._app.use(methodOverride());
        this._app.use(cookieParser());
        this._app.use(express.static(path.join(this._options.root, this._options.publicFolder)));
        if (appolo.environment.type === 'development') {
            this._app.use(errorhandler());
            this._app.use(morgan('dev'));
        }
    }
    loadCustomConfigurations() {
        let allPath = path.join(this._options.root, 'config/express/all.js'), environmentPath = path.join(this._options.root, 'config/express/', this._options.environment + '.js');
        _.forEach([allPath, environmentPath], (filePath) => {
            if (!fs.existsSync(filePath)) {
                return;
            }
            this.cachedRequire.push(filePath);
            let func = require(filePath);
            let args = appolo.Util.getFunctionArgs(func);
            let dependencies = _.map(args, (arg) => appolo.inject.getObject(arg));
            func.apply(func, dependencies);
        });
    }
    loadRoutes() {
        let routes = [], routesPath = path.join(this._options.root, 'config/routes');
        if (fs.existsSync(routesPath)) {
            for (let filePath of appolo.loader.load(this._options.root, path.join('config', 'routes'))) {
                routes.push.apply(routes, require(filePath));
                this.cachedRequire.push(filePath);
            }
        }
        //load routes
        router_1.default.initialize(this._app, routes);
    }
    _startServer() {
        if (!this._options.startServer) {
            return;
        }
        return this.startServer();
    }
    startServer() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Q.fromCallback((callback) => this._server.listen(this._port, callback));
            console.log(_.template(this._options.startMessage)({ port: this._port, version: appolo.environment.version, environment: appolo.environment.type }));
            this.fireEvent('appolo-server-started');
        });
    }
    get app() {
        return this._app;
    }
    get server() {
        return this._server;
    }
    get port() {
        return this._port;
    }
    reset(isSoftReset) {
        super.reset(isSoftReset);
        if (!isSoftReset) {
            _.forEach(this.cachedRequire, (filePath) => delete require.cache[filePath]);
            router_1.default.reset();
        }
        this.cachedRequire.length = 0;
        this._options = null;
        try {
            this._server.close();
        }
        catch (e) {
            console.log("failed to close server", e);
        }
        process.removeAllListeners();
    }
    softReset() {
        this.reset(true);
    }
}
exports.Launcher = Launcher;
exports.default = new Launcher();
//# sourceMappingURL=launcher.js.map