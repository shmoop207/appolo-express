var Controller = require('../../../lib/controller/controller');
module.exports = Controller.define({
    $config:{
        id:'testController',
        inject:['manager']
    },

    test:function(req,res){
        res.json({working:true})
    },
    validaion:function(req,res){
        res.json(req.model)
    },
    testXml: function(req, res){
        this.sendXml("<test>testXml</test>")
    }

})