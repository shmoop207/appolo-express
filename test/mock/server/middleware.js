var Middleware = require('../../../lib/middleware/middleware');
module.exports = Middleware.define({
    $config:{
        id:'testMiddleware',
        inject:['manager']
    },

    run:function(req,res,next){
        res.send({working:true,middleware:true})
    }

})