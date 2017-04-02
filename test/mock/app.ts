"use strict";
import appolo  = require('../../index');

appolo.launcher.launch({
    paths: ['config', 'server'],
    root: process.cwd() + '/test/mock'
})