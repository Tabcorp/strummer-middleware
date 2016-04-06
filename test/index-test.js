'use strict';

var expect          = require('chai').expect,
    validator       = require('./../index');

describe('bad input', function() {
    it('errors immediately if a mapping is passed in that wont work', function() {
        expect(validator.bind(validator, {})).to.throw('Specify a validation mapping to an area of the HTTP Request - i.e. query, params or body: e.g. { query: matcher }');
    });

    it('errors if the matcher doesnt exist or have an arity of two (to be compatible with Strummer matches)', function(){
        expect(validator.bind(validator, { query: { id: 'number' } })).to.throw('The match function must have an arity of at least one - match(validation)');
    });
});

describe('a failure condition', function() {
    var failingValidation = {
        match: function(one) {
            return ['Field is incorrect', one.toString()];
        }
    };

    it('triggers the next middleware with the error', function(done) {
        var middleware = validator({ body: failingValidation });

        var req = {
            body: { 
                failingVal: true
            } 
        };

        var next = function(err) {
            expect(err).to.be.ok;
            expect(err.message).to.equal('Validation failed.');
            done();
        };
        
        middleware(req, {}, next);
    });
});

describe('a successful validation', function() {
    var successfulValidation = {

        /*eslint-disable */
        match: function(one) {
            return [];
        }
        /*eslint-enable */
    };

    it('triggers the next middleware with the error', function(done) {
        var middleware = validator({body: successfulValidation});

        var req = {
            body: {
                successfulVal: true
            }
        };

        var next = function(err) {
            expect(err).to.not.be.ok;
            done();
        };

        middleware(req, {}, next);
    });
});
