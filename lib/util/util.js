"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("appolo");
class Util extends appolo.Util {
    static convertSnakeCaseToCamelCase(str) {
        return str.replace(/(\_\w)/g, function (m) {
            return m[1].toUpperCase();
        });
    }
    static getAllPropertyNames(obj) {
        var props = [];
        do {
            if (obj.prototype) {
                props = props.concat(Object.getOwnPropertyNames(obj.prototype));
            }
        } while (obj = Object.getPrototypeOf(obj));
        return props;
    }
}
exports.Util = Util;
//# sourceMappingURL=util.js.map