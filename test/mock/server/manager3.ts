"use strict";
import appolo = require('../../../index');
import {Manager2} from "./manager2";




export class Manager3 {
    manager2:Manager2
    TEST:number
    public get name():string{
        return this.constructor.name
    }
}

appolo.define('manager3')
    .type(Manager3)
    .singleton()
    .statics("TEST",1)
    .namespace("TEST.Manager3")
    .inject('manager2');