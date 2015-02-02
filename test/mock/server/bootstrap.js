var appolo = require('appolo');

module.exports = appolo.EventDispatcher.define({
    $config:{
        id:'appolo-bootstrap',
        singleton:true,
        inject:['manager']
    },
    run:function(callback){
        this.working = true;

        callback()
    }
})