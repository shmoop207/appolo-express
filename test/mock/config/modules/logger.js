var appolo = require('../../../../index');


appolo.module.register(function (env,inject,callback) {

    var logger =  {
        getName:function(){
            return env.test;
        }
    }

    inject.addObject('logger',logger);

    callback();

})