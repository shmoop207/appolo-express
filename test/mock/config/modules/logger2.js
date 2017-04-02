"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Q = require("bluebird");
function logger2(options) {
    return function (env, inject, logger) {
        let logger2 = {
            getName: function () {
                return env.test + "logger2";
            }
        };
        inject.addObject('logger2', logger2);
        return Q.delay(100);
    };
}
exports.logger2 = logger2;
//# sourceMappingURL=logger2.js.map