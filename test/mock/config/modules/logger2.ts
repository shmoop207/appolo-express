import appolo = require('../../../../index');
import Q = require('bluebird');



export function logger2(options?) {
    return  function (env:appolo.IEnv, inject:appolo.Injector, logger) {

        let logger2 = {
            getName: function () {
                return env.test + "logger2";
            }
        }

        inject.addObject('logger2', logger2);

       return Q.delay(100);
    }
}



