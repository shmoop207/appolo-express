var EventDispatcher = require('../../../lib/events/event-dispatcher');

module.exports = EventDispatcher.define({
    $config:{
        id:'manager',
        singleton:true
    }
})