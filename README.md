Appolo Express  [![Build Status](https://travis-ci.org/shmoop207/appolo-express.png?branch=master)](https://travis-ci.org/shmoop207/appolo-express) [![Dependencies status](https://david-dm.org/shmoop207/appolo-express.png)](https://david-dm.org/shmoop207/appolo-express)
=======

![appolo](https://dl.dropboxusercontent.com/u/19179794/appollo.png)

Appolo Express is an MVC Framework for Node.js build on top [expressjs][1] 4. 
Build with [appolo-class][2] class system and [appolo-inject][3] dependency injection system.
Appolo architecture follows common patten of MVC and dependency injection which makes it easy to build better performance, flexibility and easy maintenance server side in nodejs.


## Features
  * MVC Architecture
  * Powerful class system
  * dependency injection system
  * simple routing system
  * Manage easily configurations and environments 
  * Simple folder structures
  * Easy integrate third party services
  * Easy to get started
  
 
## Installation ##
```javascript
npm install appolo-express --save
```

##Quick start ##
in your app.js file
```javascript
var appolo  = require('appolo');
appolo.launcher.launch();
```

##Recommended Directory Structure ##
the environments folder must to exist every thing else is optional appolo will require all files in the config and server folders but the environments folder will be loaded first.
```javascript
- config
    - enviremnts
        - all.js
        - develpment.js
        - production.js
    - express
        -express.js
    - loggers
        - logger.js
    - routes
        routes.js
    - redis
        - redis.js
    ...
- public_folder
- server
    - controllers
    - managers
    - services
    - views
    - bootstrap.js
    ...
- app.js
   
```

##Configuration##
appolo launch configuration options

####options.paths####
Type :`array`, Default: `['config', 'server']`
The folder will be required and loaded on appolo launch

####options.root####
Type :`string`, Default: process.cwd()
the root folder of the paths option

####options.bootStrapClassId####
Type :`string`, Default: `(process.env.NODE_ENV || 'development')`
environment file name that will override the environment all.js file
default is the NODE_ENV or if not defined it will be `development`

####options.bootStrapClassId####
Type :`string`, Default: `appolo-bootstrap`
appolo will try to find the bootstrap class after it launched and run it.
this is optinal if the class is not defined nothing will happen.

####options.templateEngine####
Type :`string`, Default: 'swig'
the template engine that will used to render the views
the template engine using the [consolidate][4] module

####options.viewsFolder####
Type :`string`, Default: '/server/views'
the folder where your view templates located

####options.public####
Type :`string`, Default: 'public'
the public folder where all your assets and static files will be located

####options.loadDefaultConfigurations####
Type :`bolean`, Default: 'true'
true to load all  express default middlewares and express options. false to load custom middlewares by yourself
```javascript
app.locals.pretty = true;
app.locals.cache = 'memory';
app.set('showStackError', true);
app.use(compression({ level: 9 }));
app.enable('jsonp callback');
app.use(expressValidator());
app.use(bodyParser());
app.use(multer({ dest: './uploads/'}));
app.use(methodOverride());
app.use(cookieParser());
app.use(flash());
app.use(favicon());
app.use(express.static);
```
####options.startMessage####
Type :`string`, Default: 'Appolo Server listening on port: {port} version:{version} environment: {environment}'
the message that will be written to console log the the server starts
####options.startServer####
Type :`bolean`, Default: 'true'
if true the server will start immediately to listen to port else you will have to start in manually.
####options.port####
Type :`number`, Default: `process.env.PORT || this._options.port || appolo.environment.port || 8080)`
the port that the app will listen to.
the port will be determined in the following order if defined: `process.env.PORT`, `options.port`,`appolo.environment.port`, `8080`
####usage example:####
```javascript
var appolo  = require('appolo');

appolo.launcher.launch( {
    paths:['config', 'server'],
    root : process.cwd()+'/app',
    environment : 'testing',
    port:8182,
    templateEngine:'ejs'
    
});
```

##Environments##
With environments you can define different set of configurations depending on the environment type your app is currently running.
it is recommended to have 4 types of environments : `develpment`, `testing`, `staging`, `production`.
after `appolo.launch` you can always to access to current environment vars via `appolo.environment`.
```javascript
//all.js
module.exports = {
    name:'all'
    someVar:'someVar'
}
//develpment.js
module.exports = {
    name:'develpment'
    db:'monog://develpment-url'
}
//develpment.js
module.exports = {
    name:'testing'
    db:'monog://testing-url'
}

```
if we launch our app.js with `NODE_ENV = testing`
```javascript
var appolo  = require('appolo');
appolo.launcher.launch();
var env = appolo.environment;

console.log(env.name,env.someVar,env.db) // 'testing someVar monog:://testing-url'

```

##Express Configurations##
you can configure express app and add custom middlewares by adding configuration file to the express folder.
the express configuration file is called after the default express configurations loaded if your want to load your own custom express configurations set `loadDefaultConfigurations : false` in the appolo launch
```javascript
var favicon = require('static-favicon');

module.exports = function (app) {
    app.all('/*', function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        next();
    }
    
    app.use(favicon());
}
```
##Routes ##
you can easy define your app routes in the `config/routes` folder
the routes are the same as you defined in [expressjs][5] router
```javascript
module.exports = [
    {
        path: '/login/',
        method: 'post',
        controller: 'login',
        action: 'loginUser',
        middleware:[]
        locals:{}
    },
    {
        path: '/users/:id',
        method: 'get',
        controller: 'user',
        action: 'getUser',
        middleware:[function(res,req,next){
            //do something
            next();
        }]
        locals:{}
    }
];
```
each route have the following params:

 - `path` - same as you define in expressjs
 - `method` - one of `get`,`post`,`patch`,`delete`,`put`. default `get`
 - `controller` - the name of the controller that will be crated to handle the route the controller id must have `Controller` postfix
 - `action` - the action function the will be invoked to handle the route
 - `middleware` - array of middleware function the will be invoked be before the controller if the next function is not called or called with error the controller won`t be created.
 - `locals` - locals object the will extend res.locals 

##Controllers ##
Controllers are classes that handled the routes request.
in order the router will be able to handle to request the controller class must inherit from `appolo.Controller`
each controller action will be called with [request][6] and [response][7] objects.

```javascript
var appolo = require('appolo');
module.exports = appolo.Controller.define({
    $config:{
        id:'loginController',
        inject:['dataManager']
    },

    loginUser:function(req,res){
        this.dataManager.validateUser(req.body.username,req.body.password)
        .then(this.jsonSuccess.bind(this)
        .fail(this.serverError.bind(this);
    }
})
```
`appolo.Controller` also has some helper functions.
###`controller.render([view,model])`
view render helper function will try to find and render the view  file in view folder according to the controller name and action

 - `view` - the view name if different from the controller action
 - `model` - the model that will be passed to the view
 
```javascript
var appolo = require('appolo');
module.exports = appolo.Controller.define({
    $config:{
        id:'loginController',
        inject:['dataManager']
    },

    index:function(req,res){
        this.render({someData:'someData'}) //the will render the view from viewFolder/login/index
    }
})
```
###`controller.jsonSuccess([data])`
send json success response

 - `data` - the data object will be passed to the response

```javascript
    login:function(req,res){
        this.jsonSuccess({userId:1})
    }

//output
{
    "success":true,
    "data":{
        "userId":1
    }
}
```

###`controller.jsonError([message])`
send json error response with optinal message

 - `message` - the error message that will be passed to the response

```javascript
    login:function(req,res){
        this.jsonError("something is wrong")
    }
    
//output
{
    "success":false,
    "message":"something is wrong"
}
```

###`controller.serverError([message])`
send response server error 500 with optinal message

 - `message` - the error message that will be passed to the response

```javascript
    login:function(req,res){
        this.serverError("something is wrong")
    }
```
##Socket.io, Redis, MongoDB and More Support
you can easily integrate to popular services like socket.io redis and mongoDB in appolo.
all you have to do is to add the service configratio file to the config folder

####[Sokcet.io][8] example####
```javascript
var sio = require('socket.io'),
    appolo = require('appolo-express');

var app  = appolo.inject.getObject('app');
var io = sio.listen(app.server);

appolo.inject.addObject('io', io);
module.exports = io;
```

```javascript
var appolo  = require('appolo'),
    Q = require('q');

appolo.Class.define({
    $config:{
        id:'chatController',
        singleton: true,
        initMethod: 'initialize',
        inject:['io']
    },
    initialize:function(){
         
        this.io.sockets.on('connection', function(socket){
            socket.broadcast.to('some_room').emit('message','client connected');
        });
    }
});

```

####[Redis][9] and [Q][10] example####
```javascript
var redis = require('redis'),
    appolo = require('appolo-express'),
    url = require('url');

//you can put redis connection string in appolo environments to support different redis db in different environments
var redisURL = url.parse(appolo.environment.redisConnectionString);
var redisClient = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
if(redisURL.auth){
    redisClient.auth(redisURL.auth.split(":")[1]);
}

appolo.inject.addObject('redis', redisClient);
module.exports = redisClient;
```

```javascript
var appolo  = require('appolo'),
    Q = require('q');

appolo.Class.define({
    $config:{
        id:'dataManager',
        singleton: true,
        inject:['redis']
    },
    getData:function(){
        var deferred = Q.defer();
        
         this.redis.get('someKey', function (err, value) {
            err ? deferred.reject() : deferred.resolve(value);
         });
         
         return deferred.promise;
    }
});

```

####MongoDb with [Mongose][11] and [Q][12] example####
```javascript
var mongoose = require('mongoose'),,
    appolo = require('appolo-express');

mongoose.connect(appolo.environment.db);

var userSchema = new mongoose.Schema( name : {type: String});
var userModel = mongoose.model('User', userSchema);

appolo.inject.addObject('db', mongoose);
appolo.inject.addObject('UserModel', userModel);
module.exports = db;
```

```javascript
var appolo  = require('appolo'),
    Q = require('q');

appolo.Class.define({
    $config:{
        id:'userManager',
        singleton: true,
        inject:['UserModel']
    },
    getUser:function(id){
        var deferred = Q.defer();
       
       this.UserModel.findById(id,function(err,data){
            err ? deferred.reject() : deferred.resolve(value);
        });
        
        return deferred.promise;
    }
});

```

##Loggers ##
you can easy add logger to your server just by adding the logger configuraion file to the config folder.
####logger with [winston][13] and [sentry][14]####
```javascript
var winston = require('winston'),
    appolo = require('appolo-express'),
    Sentry = require('winston-sentry');

var transports = [];

if(appolo.environment.type == 'produnction'){
    transports.push(new Sentry({
            level: 'warn',
            dsn: "senty connection string",
            json: true,
            timestamp: true,
            handleExceptions: true,
            patchGlobal: true
    }));
}

transports.push(new (winston.transports.Console)({
    json: false,
    timestamp: true,
    handleExceptions: true
}));

var logger = new (winston.Logger)({
    transports: transports,
    exitOnError: false
});

appolo.inject.addObject('logger', logger);
module.exports = logger;
```

```javascript
var appolo  = require('appolo');

appolo.Class.define({
    $config:{
        id:'dataManager',
        singleton: true,
        initMethod: 'initialize',
        inject:['logger']
    },
    initialize:function(){
        this.logger.info("dataManager initialized",{someData:'someData'})
    }
});

```



##Class System ##
appolo have powerful class system based on [appolo-class][15].
enables you write your server code classes in elegant way with `inheritance` and `mixins` for better code reuse.
```javascript
var appolo  = require('appolo');

var Rectangle = appolo.Class.define({
    constructor: function (width, height) {
        this.height = height;
        this.width = width;
    },
    area: function () {
        return this.width * this.height;
    }
});

var Square = Rectangle.define({
    constructor: function (side) {
        this.callParent(side, side);
    }
});

var square = new Square(6);
console.log(square.area()) // 36
```

##Dependency Injection System ##
appolo have powerful [Dependency Injection][16] system based on [appolo-inject][17].
enables you to organize your code in [loose coupling][18] classes.
you can always access to injector via `appolo-inject`.
```javascript
var appolo  = require('appolo');

appolo.Class.define({
    $config:{
        id:'dataManager',
        singleton: true
    },
    getData:function(){
        ...
    }
});

appolo.Class.define({
    $config:{
        id:'fooController',
        singleton: false,
        initMethod:'initialize',
        inject:['dataManager']
    },
    constructor: function () {
        this.data = null
    },
    
    initialize:fucntion(){
        this.data =  this.dataManager.getData();
        //do something
    }
    ...
});

var fooController = appolo.inject.getObject('fooController');
console.log(fooController.data)
```

##Event Dispatcher ##
appolo have built in event dispatcher to enable classes to listen and fire events
Event Dispatcher has the following methods:

###`eventDispatcher.on(event,callback,[scope])`
add event listener

 - `event` - event name.
 - `callback` - callback function that will triggered on event name.
 - `scope` - optinal, the scope of the `callback` function default: `this`.

###`eventDispatcher.un(event,callback,[scope])`     
remove event listener all the arguments must be `===` to on method else it won`t be removed.

 -  `event` - event name.
 -  `callback` - callback function.
 -  `scope` - optinal, the scope of the callback function.
 
###`eventDispatcher.fireEvent(event,[arguments])`
fireEvent - triggers the callback functions on given event name

- `eventName`
- `arguments` -  all the rest `arguments` will be applied on the `callback` function

```javascript
var appolo  = require('appolo');

appolo.EventDispatcher.define({
    $config:{
        id:'fooManager',
        singleton: true
    },
    notifyUsers:function(){
    
        this.fireEvent('someEventName',{someData:'someData'})
    }
    ...
});

appolo.Class.define({
    $config:{
        id:'fooController',
        initMethod:'initialize',
        inject:['fooManager']
    },
    initialize:function(){
        this.fooManager.on('someEventName',function(data){
            this.doSomething(data.someData)
        },this);
    },
    doSomething:function(){
    }
    ...
});

```

##Appolo Bootstrap ##

once it lanched appolo try to find appolo `bootstrap` class and call it's `run` mehtod.
```javascript
var appolo  = require('appolo');

appolo.Class.define({
    $config:{
        id:'appolo-bootstrap',
        singleton: true,
        inject:['someManager1','someManager2']
    },
    run:function(){
        //start your application logic here
        this.someManager1.doSomeThing();
    }
    ...
});

```


    
## Tests ##
```javascript
    grunt test
```

## License ##

The `appolo` library is released under the MIT license. So feel free to modify and distribute it as you wish.


  [1]: http://expressjs.com/
  [2]: https://www.github.com/shmoop207/appolo-class
  [3]: https://www.github.com/shmoop207/appolo-inject
  [4]: https://www.npmjs.org/package/consolidate
  [5]: http://expressjs.com/4x/api.html#router
  [6]: http://expressjs.com/4x/api.html#req.params
  [7]: http://expressjs.com/4x/api.html#res.status
  [8]: https://github.com/Automattic/socket.io
  [9]: https://github.com/mranney/node_redis
  [10]: https://github.com/kriskowal/q
  [11]: https://github.com/LearnBoost/mongoose
  [12]: https://github.com/kriskowal/q
  [13]: https://github.com/flatiron/winston
  [14]: https://github.com/getsentry/sentry
  [15]: https://github.com/shmoop207/appolo-class
  [16]: http://en.wikipedia.org/wiki/Dependency_injection
  [17]: https://github.com/shmoop207/appolo-inject
  [18]: http://en.wikipedia.org/wiki/Loose_coupling
