var _ = require('lodash'),
    appolo = require("appolo");


function addDefinition(name, args, type) {
    if (!type.prototype.__inject__) {
        type.prototype.__inject__ = []
    }

    type.prototype.__inject__.push({name: name, args: args})
}

function addDefinitionClass(name, args) {
    return function (name, args, fn) {
        var appoloDef = fn.prototype.__inject__;
        if (_.isArray(appoloDef)) {
            addDefinition(name, args, fn)
        } else {
            appoloDef[name].apply(appoloDef, args)
        }
    }.bind(null, name, args)
}

function addDefinitionProperty(name, args) {
    return function (name, args, target, propertyKey, descriptor) {
        args.unshift(propertyKey);
        addDefinition(name, args, target.constructor)
    }.bind(null, name, args)
}

exports.define = function (id) {
    return function (id, fn) {
        var appoloDef = appolo.define(id || _.camelCase(fn.name), fn);

        _.forEach(fn.prototype.__inject__, (item) => appoloDef[item.name].apply(appoloDef, item.args))

        fn.prototype.__inject__ = appoloDef;

    }.bind(null, id);
}

exports.singleton = function (singleton) {
    if (singleton == false) {
        return function () {
        }

        return addDefinitionClass("singleton", [])
    }
}


exports.alias = function (alias) {
    return addDefinitionClass("alias", [alias]);
}


exports.aliasFactory = function (aliasFactory) {

    return addDefinitionClass("aliasFactory", [aliasFactory]);
}


exports.initMethod = function () {

    return addDefinitionProperty("initMethod", []);
}

exports.inject = function (inject) {

    return addDefinitionProperty("inject", [inject]);
}


exports.injectFactoryMethod = function (factoryMethod) {

    return addDefinitionProperty("injectFactoryMethod", [factoryMethod]);
}

exports.injectAlias = function (alias) {

    return addDefinitionProperty("injectAlias", [alias]);
}

exports.injectAliasFactory = function (alias) {

    return addDefinitionProperty("injectAliasFactory", [alias]);
}

exports.injectArray = function (arr) {

    return addDefinitionProperty("injectArray", [arr]);
}

exports.injectDictionary = function (dic) {

    return addDefinitionProperty("injectDictionary", [dic]);
}

exports.injectFactory = function (factory) {

    return addDefinitionProperty("injectFactory", [factory]);

}

exports.injectObjectProperty = function (object, propertyName) {

    return addDefinitionProperty("injectObjectProperty", [object, propertyName]);
}

exports.injectValue = function (value) {

    return addDefinitionProperty("injectValue", [value]);
}


