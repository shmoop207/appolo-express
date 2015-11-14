"use strict";
var appolo = require('../../../index');




class Manager3 {

}

appolo.define('manager3')
    .type(Manager3)
    .singleton()
    .statics("TEST",1)
    .namespace("TEST.Manager3")
    .inject('manager2');