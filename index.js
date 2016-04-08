'use strict';

var _                   = require('lodash'),
    InvalidSyntaxError  = require('./lib/invalid-syntax-error');

var AREAS = ['params', 'query', 'body'];

var errorMessages = {
    params: 'Invalid request parameters',
    query: 'Invalid query string',
    body: 'Invalid request payload'
};

module.exports = function(validation) {
    var properties = Object.keys(validation);

    //ensure a validation exists for the possible HTTP input locations, otherwise error immediately
    var checks = (_.intersection(AREAS, properties));
    if (checks.length == 0) {
        throw new Error('Specify a validation mapping to an area of the HTTP Request - i.e. query, params or body: e.g. { query: matcher }');
    }

    if (!validation[checks[0]].match || validation[checks[0]].match.length < 1) {
        throw new Error('The match function must have an arity of at least one - match(validation)');
    }

    return function(req, res, next) {
        var result = validate(req[checks[0]], validation[checks[0]]);
        if (result.length > 0) {
            return next(new InvalidSyntaxError(errorMessages[checks[0]], result));
        }

        next();
    };
};

function validate(requestData, matcher) {
    return matcher.match(requestData);
}
