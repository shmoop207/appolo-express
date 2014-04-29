var EventDispatcher = require('../../../lib/events/event-dispatcher');

module.exports = EventDispatcher.define({
    $config:{
        id:'appolo-bootstrap',
        singleton:true,
        inject:['manager']
    },
    initialize:function(){
        this.working = true;
    }
})