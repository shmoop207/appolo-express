"use strict";
var appolo = require('../../../index');

let $config = {
    id: 'appolo-bootstrap',
    singleton: true,
    inject: ['manager']
}

class Bootstrap {

    run (callback) {
        this.working = true;

        setTimeout(callback,10)
    }
}


module.exports = appolo.define($config,Bootstrap);