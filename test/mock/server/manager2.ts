"use strict";
import appolo = require('../../../index');



export   class Manager2 {
    static get $config(){
        return {
            id: 'manager2',
            singleton: true
        }
    }

    public get name():string{
        return this.constructor.name
    }
}

module.exports = Manager2