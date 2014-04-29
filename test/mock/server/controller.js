var EventDispatcher = EventDispatcher = require('../../../lib/events/event-dispatcher');
module.exports = EventDispatcher.define({
    $config:{
        id:'controller',
        singleton:true,
        inject:['manager']
    }
})