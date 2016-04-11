'use strict';

var AREAS = {
    params: 'Invalid request parameters',
    query: 'Invalid query string',
    body: 'Invalid request payload',
    headers: 'Invalid request headers'
};

module.exports = function(checks) {

    // first validate the middleware options
    validateOptions(checks);

    // return actual middleware
    // unwind loop for better performance
    return function(req, res, next) {
        var err = errorsFrom(checks, req, 'params')
               || errorsFrom(checks, req, 'query')
               || errorsFrom(checks, req, 'body')
               || errorsFrom(checks, req, 'headers')
               || null;
        next(err);
    };

};

function validateOptions(checks) {
    var validChecks = 0;
    Object.keys(AREAS).forEach(function(area) {
        var matcher = checks[area];
        if (matcher) {
            if (isMatcher(matcher)) ++validChecks;
            else throw new Error(area + ' should be a valid matcher');
        }
    });
    if (validChecks === 0) {
        var keys = Object.keys(AREAS).join(',');
        throw new Error('Specify at least one validation from: ' + keys);
    }
}

function isMatcher(check) {
    var fn = check.match;
    return fn && (typeof fn === 'function') && (fn.length === 1 || fn.length === 2);
}

function errorsFrom(checks, req, area) {
    if (checks[area]) {
        var result = checks[area].match(null, req[area]);
        if (result.length > 0) {
            var err = new Error(AREAS[area]);
            err.details = result;
            return err;
        }
    }
    return null;
}
