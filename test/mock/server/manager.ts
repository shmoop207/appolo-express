"use strict";
import appolo = require('../../../index');
import {Manager3} from "./manager3";
import {Manager2} from "./manager2";


let $config = {
    id: 'manager',
    singleton: true,
    inject:['manager2','manager3']
};

export class Manager {
    manager2:Manager2
    manager3:Manager3
    public get name():string{
        return this.constructor.name
    }
}

 appolo.define('manager')
     .type(Manager)
     .inject('manager2 manager3')
     .singleton();