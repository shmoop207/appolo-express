import _ = require('lodash');
import appolo = require('appolo');



export class Util extends appolo.Util{
    public static convertSnakeCaseToCamelCase (str:string) {
        return str.replace(/(\_\w)/g, function (m) {
            return m[1].toUpperCase();
        });
    }

   public static getAllPropertyNames (obj) {
        var props = [];

        do {
            if (obj.prototype) {
                props = props.concat(Object.getOwnPropertyNames(obj.prototype));
            }

        } while (obj = Object.getPrototypeOf(obj));

        return props;
    }
}