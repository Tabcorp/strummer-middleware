/* eslint-disable no-unused-vars */

exports.success = function() {
    return {
        match: function(path, value) {
            return [];
        }
    };
};

exports.failure = function() {
    return {
        match: function(path, value) {
            return [{ path: path, value: value, message: 'should not be ' + value }];
        }
    };
};

exports.invalid = function() {
    return {
        // should take 1 or 2 arguments
        match: function() {
            return [];
        }
    };
};

exports.spy = function() {
    var callCount = 0;
    return {
        match: function(path, value) {
            ++callCount;
            return [];
        },
        count: function() {
            return callCount;
        }
    };
};
