"use strict";
var EventDispatcher = require('../events/event-dispatcher'),
    loader = require('../loader/loader'),
    environments = require('../environments/environments'),
    inject = require('../inject/inject'),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash');

var Launcher = EventDispatcher.define({

    constructor: function () {
        this.cachedRequire = [];

    },

    launch: function (config) {

        var defaults = {
            paths:['config', 'server'],
            root : process.cwd(),
            environment : (process.env.NODE_ENV || 'development'),
            bootStrapClassId :'appolo-bootstrap'
        }

        this._options = _.extend(defaults ,config || {});

        this.loadEnvironments();

        var loadPaths = _.union(this._options.paths, environments.paths);

        //load env files
        loader.loadFiles(loadPaths, this._options.root,this.cachedRequire);

        this.loadInjector();

        this.fireEvent('appolo-launched');
    },

    loadEnvironments: function () {
        var allPath = path.join(this._options.root, 'config/environments/all'),
            environmentPath = path.join(this._options.root, 'config/environments/', this._options.environment + '.js'),
            all = require(allPath),
            environment = require(environmentPath);

        this.cachedRequire.push(allPath);
        this.cachedRequire.push(environmentPath);

        //add current env config to appolo env
        _.extend(environments, all, environment || {});

        //save evn name
        environments.type = this._options.environment;

        //add root
        environments.rootDir = this._options.root;

        inject.addObject('environment', environments);
        inject.addObject('env', environments);
    },

    loadInjector: function () {
        var definitions = {},
            injectPath = path.join(this._options.root, 'config/inject');

        if (fs.existsSync(injectPath)) {

            fs.readdirSync(injectPath).forEach(function (file) {
                var injectPath = path.join(this._options.root, 'config', 'inject', file);
                this.cachedRequire.push(injectPath);
                _.extend(definitions, require(injectPath));
            }.bind(this));
        }

        //load inject
        inject.initialize({
            definitions: definitions,
            root: this._options.root
        });

        this.loadBootStrap();

    },

    loadBootStrap:function(){
        var bootstrapDef = inject.getDefinition(this._options.bootStrapClassId);

        if(bootstrapDef){
            var bootstrap = inject.getObject(this._options.bootStrapClassId);

            bootstrap.initialize();
        }

    },

    reset:function(){
        _.forEach(this.cachedRequire,function(filePath){
            delete require.cache[filePath];
        });
        this.cachedRequire.length = 0;
        this._options = null;
        _.forEach(environments,function(value,key){
            delete environments[key];
        });

        inject.reset();

        process.removeAllListeners();
    }
});

module.exports = new Launcher();