"use strict";

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

module.exports.loadFiles = function loadFiles(paths,root,cachedRequire) {

    if(!paths){
        return;
    }

    for (var i = 0, length = paths.length; i < length; i++) {

        var location = paths[i],

            files = fs.readdirSync(path.join(root, location)),
            filePath,
            file;

        for (var j = 0, lengthFiles = files.length; j < lengthFiles; j++) {

            file = files[j];
            filePath = location + '/' + file;

            if (fs.statSync(path.join(root,filePath)).isDirectory()) {

                if (file.match(/^\.(git|svn)$/)) {
                    return;
                }

                loadFiles([filePath],root,cachedRequire);

            } else {
                if (file.match(/\.js$/)) {
                    var tempPath = path.join(root, filePath);

                    if(cachedRequire && _.isArray(cachedRequire)){
                        cachedRequire.push(tempPath);
                    }

                    require(tempPath);

                }
            }
        }
    }
};