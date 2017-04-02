import appolo = require('../../../../index');

import {logger} from './logger';
import  {logger2} from './logger2' ;

//module.exports = function(env){
    appolo.use(logger)
    appolo.use(logger2({test:'test'}))
//}