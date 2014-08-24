
var appolo = require('appolo'),
    launcher = require('./lib/launcher/launcher');

module.exports = {
    Class : appolo.Class,
    Controller : require('./lib/controller/controller'),
    Middleware : require('./lib/middleware/middleware'),
    EventDispatcher :appolo.EventDispatcher,
    router : require('./lib/routes/router'),
    inject : appolo.inject,
    loader : appolo.loader,
    launcher : launcher,
    environment : appolo.environment,
    express : require('express'),
    validator : require('joi'),
    module : appolo.module,
    _ : appolo._,
    use:function(func){
        appolo.module.register(func);
    },
    launch:function(config,callback){
        launcher.launch(config,callback);
    }
}


