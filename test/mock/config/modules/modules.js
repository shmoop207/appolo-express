var appolo = require('../../../../index');

var logger = require('./logger'),
    logger2 = require('./logger2')

//module.exports = function(env){
    appolo.use(logger)
    appolo.use(logger2({test:'test'}))
//}