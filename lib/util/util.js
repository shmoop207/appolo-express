var _ = require('lodash');


_.mixin({
    convertSnakeCaseToCamelCase:function(str){
        return str.replace(/(\_\w)/g, function (m) {
            return m[1].toUpperCase();
        });
    }
})