var Joi = require('joi');

module.exports = [
    {
        path: '/test/',
        method: 'get',
        controller: 'test',
        action: 'test',
        middleware:[function(req,res,next){next()}]
    },
    {
        path: '/test/middleware/',
        method: 'get',
        controller: 'test',
        action: 'test',
        middleware:['testMiddleware']
    },
    {
        path: '/test/validations/',
        method: 'get',
        controller: 'test',
        action: 'validaion',
        validations:{
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().alphanum().min(3).max(30).required()
        }
    },
    {
        path: '/xml/test/',
        method: 'get',
        controller: 'test',
        action: 'testXml'

    }
];