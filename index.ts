import appolo = require('appolo');
import    launcher from './lib/launcher/launcher';

export {EventDispatcher, Util, module, inject, loader, environment, use,IEnv,IBootstrap,IDefinition,IFactory,Injector} from  'appolo';
export {Define } from './lib/define/define'
export {define } from './lib/define/defineFn'
export {default as route, Route}  from './lib/routes/route';

export {Controller} from './lib/controller/controller';

export {Middleware} from './lib/middleware/middleware';
export {default as router, Router} from './lib/routes/router';

export {default as launcher} from './lib/launcher/launcher';

export  import   validator =  require('joi');
export  import   express =  require('express');
import {IOptions} from "./lib/IOptions";


export let launch = function (config: IOptions, callback?: (err?: any) => void): Promise<void> {
    return launcher.launch(config,callback );
};



