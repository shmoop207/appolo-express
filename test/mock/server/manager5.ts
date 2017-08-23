"use strict";
import appolo = require('../../../index');
import {define,singleton,inject,lazy}  from '../../../decorators' ;
import {Manager3} from "./manager3";



@define()
@singleton()
@lazy()
export class Manager5 {

    @inject() manager3:Manager3
    public get name():string{
        return this.constructor.name
    }
}

