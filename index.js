'use strict';

var VALIDATION_AREAS = {
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
        var errors = [];
        var collectedDetails = [];
        var collectedAreas = [];

        Object.keys(VALIDATION_AREAS).forEach(function(area) {
            var err = errorsFrom(checks, req, area);
            if (err) {
                errors.push(err);
                collectedAreas.push(area);
                Array.prototype.push.apply(collectedDetails, err.details);
            }
        });

        if (errors.length > 1) {
            var msg = 'There were combined errors in ' + (collectedAreas.join(', ')) + '.';
            var err = new Error(msg);
            err.details = collectedDetails;
            next(err);
        } else {
            next(errors[0]);
        }
    };
};

module.exports.setValidationArea = function(name, errorString) {
  VALIDATION_AREAS[name] = errorString;
}

function validateOptions(checks) {
    var validChecks = 0;
    Object.keys(VALIDATION_AREAS).forEach(function(area) {
        var matcher = checks[area];
        if (matcher) {
            if (isMatcher(matcher)) ++validChecks;
            else throw new Error(area + ' should be a valid matcher');
        }
    });
    if (validChecks === 0) {
        var keys = Object.keys(VALIDATION_AREAS).join(',');
        throw new Error('Specify at least one validation from: ' + keys);
    }
}

function isMatcher(check) {
    var fn = check.match;
    return fn && (typeof fn === 'function') && (fn.length === 1 || fn.length === 2);
}

function errorsFrom(checks, req, area) {
    if (checks[area]) {
        var result = checks[area].match(area, req[area]);
        if (result.length > 0) {
            var err = new Error(VALIDATION_AREAS[area]);
            err.details = result;
            return err;
        }
    }
    return null;
}
