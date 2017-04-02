"use strict";
import appolo = require('../../../index');
import {define,singleton,inject}  from '../../../decorators' ;
import {Manager3} from "./manager3";



@define()
@singleton()
export class Manager4 {

    @inject() manager3:Manager3
    public get name():string{
        return this.constructor.name
    }
}

