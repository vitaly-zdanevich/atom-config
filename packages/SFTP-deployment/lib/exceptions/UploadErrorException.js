var util = require('util');

var Exception = require('./Exception');

//////////////////
// Ctor
//////////////////

function UploadErrorException(file, message) {
    Exception.apply(
        this,
        ['Cannot upload file "' + file + '" : ' + message]
    );
}

util.inherits(UploadErrorException, Exception);

module.exports = UploadErrorException;
