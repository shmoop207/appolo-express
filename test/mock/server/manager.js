"use strict";
var appolo = require('../../../index');


let $config = {
    id: 'manager',
    singleton: true,
    inject:['manager2','manager3']
};

class Manager {

}

module.exports = appolo.define($config, Manager);