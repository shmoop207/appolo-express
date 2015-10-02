var _ = require('lodash');


_.mixin({
    convertSnakeCaseToCamelCase: function (str) {
        return str.replace(/(\_\w)/g, function (m) {
            return m[1].toUpperCase();
        });
    },

    getAllPropertyNames: function (obj) {
        var props = [];

        do {
            if (obj.prototype) {
                props = props.concat(Object.getOwnPropertyNames(obj.prototype));
            }

        } while (obj = Object.getPrototypeOf(obj));

        return props;
    }
})