import appolo = require('../../../../index');


export  function logger(env,inject:appolo.Injector,callback) {

    let logger =  {
        getName:function(){
            return env.test;
        }
    }

    inject.addObject('logger',logger);

    callback();

}