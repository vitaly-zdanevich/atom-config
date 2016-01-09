//////////////////
// Requires
//////////////////

var Promise = require('bluebird');
var util = require('util');
var fs = require('fs');
var path = require('path');

var File = require('./File');
var Directory = require('./Directory');

//////////////////
// Ctor
//////////////////

function FileManager() {
}

//////////////////
// Methods
//////////////////

/**
 * Get the file of current open tab
 */
FileManager.prototype.getCurrentFile = function() {
    var deferred = Promise.pending();

    try {
        deferred.fulfill(new File(atom.workspace.paneContainer.activePane.activeItem.buffer.file.path));
    } catch(e) {
        deferred.reject(e);
    }

    return deferred.promise;
};

/**
 * Get the files of open tabs
 * @return {File[]}
 */
FileManager.prototype.getOpenFiles = function() {
    var deferred = Promise.pending();

    try {
        var files = [];
        var items = atom.workspace.getActivePane().getItems();
        for (var i in items) {
          files.push(new File(items[i].buffer.file.path));
        }
        deferred.fulfill(files);
    } catch(e) {
        deferred.reject(e);
    }

    return deferred.promise;
};

var treatPath = function(_path, results, deep) {
    var stats = fs.statSync(_path);

    if (stats.isDirectory()) {
        if (deep) {
            var files = fs.readdirSync(_path);
            for (var i in files) {
                treatPath(path.join(_path, files[i]), results, deep);
            }
        } else {
            results.push(new Directory(_path));
        }
    } else {
        if (results.indexOf(_path) < 0) {
            results.push(new File(_path));
        }
    }
}

/**
 * Get the files of open tabs
 * @return {File[]}
 */
FileManager.prototype.getSelection = function(deep) {
    var deferred = Promise.pending();

    try {
        var selectedPaths = atom.workspace.getLeftPanels()[0].getItem().selectedPaths();
        var files = [];
        for (var i in selectedPaths) {
            treatPath(selectedPaths[i], files, deep);
        }
        deferred.resolve(files);
    } catch(e) {
        deferred.reject(e);
    }

    return deferred.promise;
};

module.exports = new FileManager();
