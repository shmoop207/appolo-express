
var appolo = require('appolo');

module.exports = {
    Class : appolo.Class,
    Controller : require('./lib/controller/controller'),
    Middleware : require('./lib/middleware/middleware'),
    EventDispatcher :appolo.EventDispatcher,
    router : require('./lib/routes/router'),
    inject : appolo.inject,
    loader : appolo.loader,
    launcher : require('./lib/launcher/launcher'),
    environment : appolo.environment,
    express : require('express'),
    validator : require('joi'),
    module : appolo.module,
    _ : appolo._
}


