var Controller = require('../../../lib/controller/controller');
module.exports = Controller.define({
    $config:{
        id:'testController',
        inject:['manager']
    },

    test:function(req,res){
        res.json({working:true})
    }

})