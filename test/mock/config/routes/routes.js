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
    }
];