'use strict'

module.exports = function(options) {
    if (!options) {
        return (req, res, next) => { next(); };
    }


    if (typeof validation.match !== 'function') {
        throw new Error('Validation does not provide a match(path, value) function. See https://github.com/TabDigital/strummer.');
    }

    return (req, res, next) => {

    }
};

