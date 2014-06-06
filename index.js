
var appolo = require('appolo');

module.exports = {
    Class : appolo.Class,
    Controller : require('./lib/controller/controller'),
    EventDispatcher :appolo.EventDispatcher,
    router : require('./lib/routes/router'),
    inject : appolo.inject,
    loader : appolo.loader,
    launcher : require('./lib/launcher/launcher'),
    environment : appolo.environment,
    express : require('express'),
    _ : appolo._
}


