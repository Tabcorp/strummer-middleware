'use strict';

//See https://github.com/TabDigital/api-middleware/blob/master/src/middleware/validator.coffee#L5

var httpErrors  = require('http-custom-errors'),
    util        = require('util'),
    err;

err = function InvalidSyntaxError(message, fields, code) {
    this.message = message;
    this.fields = { details: fields }; //see original src code above
    this.status = 'InvalidSyntax';
    this.code = code;
};

util.inherits(err, httpErrors.BadRequestError);

module.exports = err;
