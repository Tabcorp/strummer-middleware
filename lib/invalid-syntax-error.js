'use strict';

var httpErrors  = require('http-custom-errors'),
    util        = require('util'),
    err;

err = function InvalidSyntaxError(message, fields) {
    this.message = message;
    this.fields = fields;
    this.status = 'InvalidSyntax';
};

util.inherits(err, httpErrors.BadRequestError);

module.exports = err;
