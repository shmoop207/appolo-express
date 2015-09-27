"use strict";
var appolo = require('../../../index');


let $config = {
    id: 'manager',
    singleton: true
};

class Manager {

}

module.exports = appolo.define($config, Manager);