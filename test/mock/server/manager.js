var appolo = require('appolo');

module.exports = appolo.EventDispatcher.define({
    $config:{
        id:'manager',
        singleton:true
    }
})