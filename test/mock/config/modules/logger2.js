var appolo = require('../../../../index');



function testModule(options) {
    return  function (env, inject, logger, callback) {

        var logger = {
            getName: function () {
                return env.test + "logger2";
            }
        }

        inject.addObject('logger2', logger);

        setTimeout(function () {
            callback();
        }, 100)
    }
}


appolo.module.register(testModule({test:'test'}))


