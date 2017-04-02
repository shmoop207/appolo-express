"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const define_1 = require("./define");
const appolo = require("appolo");
function define($config, klass) {
    if (_.isString($config) || _.isFunction($config)) {
        return new define_1.Define($config, klass);
    }
    appolo.define($config, klass);
}
exports.define = define;
//# sourceMappingURL=defineFn.js.map