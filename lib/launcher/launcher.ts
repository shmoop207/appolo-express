"use strict";
import appolo = require('appolo');
import    router from '../routes/router';
import    express = require('express');
import    path = require('path');
import    http = require('http');
import    https = require('https');
import    fs = require('fs');
import    favicon = require('serve-favicon');
import    morgan = require('morgan');
import    compression = require('compression');
import    bodyParser = require('body-parser');
import    methodOverride = require('method-override');
import    cookieParser = require('cookie-parser');
import    Q = require('bluebird');
import    _ = require('lodash');
import    consolidate = require('consolidate');
import    multer = require('multer');
import    errorhandler = require('errorhandler');
import {IOptions} from "../interfaces/IOptions";

export class Launcher extends appolo.Launcher {

    protected _app:express.Application;
    protected _server :http.Server|https.Server;
    protected _options: IOptions;
    protected _port:number;

    public async launch(config?: IOptions, callback?: (err?: any) => void): Promise<void> {

        try{
            appolo.inject.addObject('appolo', require("../../index"));
            this._options  = this.loadOptions(config);

           super.loadEnvironments();

            this.createServer();

            this.bindProcessEvents();

            await super.loadModules();

            super.loadFiles();

            super.loadInjector();

            this.setPort();

            this.loadDefaultConfigurations();

            this.loadCustomConfigurations();

            this.loadRoutes();

            await super.loadBootStrap();

            this._startServer();

            callback && callback();

            this.fireEvent('appolo-launched');

        }catch(e){
            if (!callback) {
                throw e;
            }

            callback(e);
        }
    }

    protected loadOptions(config:IOptions):IOptions {
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

        return  _.extend(defaults, dto || {});
    }

    protected bindProcessEvents() {
        process.on('uncaughtException', function (err) {
            if (err.errno === 'EADDRINUSE') {
                console.error(`EADDRINUSE!!!! address in use port: ${this.app.get('port')}`)
                process.exit(1);
            }
            else {
                console.error(err.stack || err.toString())
            }

        }.bind(this))
    }

    protected createServer() {

        this._app = express();

        let server:http.Server | https.Server;

        let ssl = this._options.ssl || appolo.environment.ssl;

        if (ssl && ssl.key && ssl.cert) {
            let options = {
                key: fs.readFileSync(ssl.key),
                cert: fs.readFileSync(ssl.cert)
            };

            server = https.createServer(options, this._app);

        } else {

            server = http.createServer(this._app);
        }

        this._server =  server;

        appolo.inject.addObject('app', this._app);

        appolo.inject.addObject('router', router);
    }



    protected setPort() {

        this._port = process.env.APP_PORT || process.env.PORT || this._options.port || appolo.environment.port || 8080;

        this._app.set('port', this._port);
    }

    protected loadDefaultConfigurations() {


        if (!this._options.loadDefaultConfigurations) {
            return
        }

        this._app.locals.pretty = true;

        this._app.locals.cache = 'memory';

        this._app.use(compression({level: 9}));

        this._app.engine('html', consolidate[this._options.templateEngine]);

        this._app.set('view engine', 'html');

        this._app.set('views', path.join(this._options.root, this._options.viewsFolder));

        this._app.enable('jsonp callback');

        if (fs.existsSync(this._options.publicFolder + '/favicon.ico')) {
            this._app.use(favicon(this._options.publicFolder + '/favicon.ico'));
        }

        if(this._options.useBodyParser){
            this._app.use(bodyParser.urlencoded({
                extended: true
            }));

            this._app.use(bodyParser.json());
        }

        if(this._options.useMulter){
            this._app.use(multer({dest: path.join(this._options.root, this._options.uploadsFolder)}).array('file'));
        }

        this._app.use(methodOverride());

        this._app.use(cookieParser());


        this._app.use(express.static(path.join(this._options.root, this._options.publicFolder)));

        if (appolo.environment.type === 'development') {
            this._app.use(errorhandler());
            this._app.use(morgan('dev'));
        }
    }

    protected loadCustomConfigurations() {

        let allPath = path.join(this._options.root, 'config/express/all.js'),
            environmentPath = path.join(this._options.root, 'config/express/', this._options.environment + '.js');

        _.forEach([allPath, environmentPath], (filePath) => {

            if (!fs.existsSync(filePath)) {
                return;
            }

            this.cachedRequire.push(filePath);

            let func = require(filePath);

            let args = appolo.Util.getFunctionArgs(func);

            let dependencies = _.map(args, (arg) =>  appolo.inject.getObject(arg));

            func.apply(func, dependencies);

        });
    }

    protected loadRoutes() {
        let routes = [],
            routesPath = path.join(this._options.root, 'config/routes');

        if (fs.existsSync(routesPath)) {
            for (let filePath of appolo.loader.load(this._options.root, path.join('config', 'routes'))) {

                routes.push.apply(routes, require(filePath));

                this.cachedRequire.push(filePath);
            }
        }

        //load routes
        router.initialize(this._app, routes);
    }

    protected _startServer() {

        if (!this._options.startServer) {
            return
        }

        return this.startServer();
    }


    public async startServer() {
        await Q.fromCallback((callback:(err: any, result?: any) => void)=>this._server.listen(this._port,callback));

        console.log(_.template(this._options.startMessage)({port:this._port, version:appolo.environment.version, environment:appolo.environment.type}));

        this.fireEvent('appolo-server-started');

    }

    public get app():express.Application{
        return this._app
    }

    public get server():http.Server|https.Server{
        return this._server
    }

    public get port():number{
        return this._port
    }


    public reset(isSoftReset?:boolean) {

        super.reset(isSoftReset);

        if (!isSoftReset) {

            _.forEach(this.cachedRequire, (filePath) => delete require.cache[filePath]);

            router.reset();
        }

        this.cachedRequire.length = 0;
        this._options = null;

        try {
            this._server.close();
        } catch (e) {
            console.log("failed to close server", e)
        }

        process.removeAllListeners();
    }

    public softReset() {
        this.reset(true)
    }
}

export default new Launcher();