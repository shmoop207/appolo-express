"use strict";

import    _ = require('lodash');
import {IDefinition} from "../IDefinition";
import {Define} from "./define";
import * as appolo from "appolo";

export function define($config: string | IDefinition, klass?: Function): Define {

    if (_.isString($config) || _.isFunction($config)) {
        return new Define($config, klass);
    }

    appolo.define($config, klass);


}
