"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const appolo = require("appolo");
function addDefinition(name, args, type) {
    if (!type.prototype.__inject__) {
        type.prototype.__inject__ = [];
    }
    type.prototype.__inject__.push({ name: name, args: args });
}
function addDefinitionClass(name, args) {
    return function (name, args, fn) {
        let appoloDef = fn.prototype.__inject__;
        if (!appoloDef || _.isArray(appoloDef)) {
            addDefinition(name, args, fn);
        }
        else {
            appoloDef[name].apply(appoloDef, args);
        }
    }.bind(null, name, args);
}
function addDefinitionProperty(name, args) {
    return function (name, args, target, propertyKey, descriptor) {
        args.unshift(propertyKey);
        addDefinition(name, args, target.constructor);
    }.bind(null, name, args);
}
function define(id) {
    return function (id, fn) {
        let appoloDef = appolo.define(id || (fn.name.charAt(0).toLowerCase() + fn.name.slice(1)), fn);
        _.forEach(fn.prototype.__inject__, (item) => appoloDef[item.name].apply(appoloDef, item.args));
        fn.prototype.__inject__ = appoloDef;
    }.bind(null, id);
}
exports.define = define;
function singleton(singleton) {
    if (singleton === false) {
        return function () {
        };
    }
    return addDefinitionClass("singleton", []);
}
exports.singleton = singleton;
function lazy(lazy) {
    if (lazy === false) {
        return function () {
        };
    }
    return addDefinitionClass("lazy", []);
}
exports.lazy = lazy;
function alias(alias) {
    return addDefinitionClass("alias", [alias]);
}
exports.alias = alias;
function aliasFactory(aliasFactory) {
    return addDefinitionClass("aliasFactory", [aliasFactory]);
}
exports.aliasFactory = aliasFactory;
function initMethod() {
    return addDefinitionProperty("initMethod", []);
}
exports.initMethod = initMethod;
function inject(inject) {
    return addDefinitionProperty("inject", [inject]);
}
exports.inject = inject;
function injectFactoryMethod(factoryMethod) {
    return addDefinitionProperty("injectFactoryMethod", [factoryMethod]);
}
exports.injectFactoryMethod = injectFactoryMethod;
function injectAlias(alias, indexBy) {
    return addDefinitionProperty("injectAlias", [alias, indexBy]);
}
exports.injectAlias = injectAlias;
function injectAliasFactory(alias, indexBy) {
    return addDefinitionProperty("injectAliasFactory", [alias, indexBy]);
}
exports.injectAliasFactory = injectAliasFactory;
function injectArray(arr) {
    return addDefinitionProperty("injectArray", [arr]);
}
exports.injectArray = injectArray;
function injectDictionary(dic) {
    return addDefinitionProperty("injectDictionary", [dic]);
}
exports.injectDictionary = injectDictionary;
function injectFactory(factory) {
    return addDefinitionProperty("injectFactory", [factory]);
}
exports.injectFactory = injectFactory;
function injectObjectProperty(object, propertyName) {
    return addDefinitionProperty("injectObjectProperty", [object, propertyName]);
}
exports.injectObjectProperty = injectObjectProperty;
function injectValue(value) {
    return addDefinitionProperty("injectValue", [value]);
}
exports.injectValue = injectValue;
//# sourceMappingURL=decorators.js.map