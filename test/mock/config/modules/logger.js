var appolo = require('../../../../index');


module.exports = function (env,inject,callback) {

    var logger =  {
        getName:function(){
            return env.test;
        }
    }

    inject.addObject('logger',logger);

    callback();

}