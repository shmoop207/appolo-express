import _ = require('lodash');
import    appolo = require("appolo");


function addDefinition(name, args, type) {
    if (!type.prototype.__inject__) {
        type.prototype.__inject__ = []
    }

    type.prototype.__inject__.push({name: name, args: args})
}

function addDefinitionClass(name, args) {
    return function (name, args, fn) {
        let appoloDef = fn.prototype.__inject__;
        if (!appoloDef || _.isArray(appoloDef)) {
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

export function define(id?: string) {
    return function (id, fn) {
        let appoloDef = appolo.define(id || (fn.name.charAt(0).toLowerCase() + fn.name.slice(1)), fn);

        _.forEach(fn.prototype.__inject__, (item) => appoloDef[item.name].apply(appoloDef, item.args))

        fn.prototype.__inject__ = appoloDef;

    }.bind(null, id);
}

export function singleton(singleton?: boolean) {
    if (singleton === false) {
        return function () {
        }
    }

    return addDefinitionClass("singleton", [])
}


export function alias(alias: string) {
    return addDefinitionClass("alias", [alias]);
}


export function aliasFactory(aliasFactory: string) {

    return addDefinitionClass("aliasFactory", [aliasFactory]);
}


export function initMethod() {

    return addDefinitionProperty("initMethod", []);
}

export function inject(inject?: string) {

    return addDefinitionProperty("inject", [inject]);
}


export function injectFactoryMethod(factoryMethod: string) {

    return addDefinitionProperty("injectFactoryMethod", [factoryMethod]);
}

export function injectAlias(alias: string, indexBy?: string) {

    return addDefinitionProperty("injectAlias", [alias, indexBy]);
}

export function injectAliasFactory(alias: string, indexBy?: string) {

    return addDefinitionProperty("injectAliasFactory", [alias, indexBy]);
}

export function injectArray(arr: string) {

    return addDefinitionProperty("injectArray", [arr]);
}

export function injectDictionary(dic: string) {

    return addDefinitionProperty("injectDictionary", [dic]);
}

export function injectFactory(factory: string) {

    return addDefinitionProperty("injectFactory", [factory]);
}

export function injectObjectProperty(object: string, propertyName: string) {

    return addDefinitionProperty("injectObjectProperty", [object, propertyName]);
}

export function injectValue(value: any) {

    return addDefinitionProperty("injectValue", [value]);
}


