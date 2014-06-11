module.exports = [
    {
        path: '/test/',
        method: 'get',
        controller: 'test',
        action: 'test',
        middleware:[function(req,res,next){next()},'testMiddleware']
    }
];