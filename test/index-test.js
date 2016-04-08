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

var failingValidation = {
    /*eslint-disable */
    match: function(one) {
    /*eslint-enable */
        //this is a strummer like return value
        return [{ path: 'failingVal', value: true, message: 'should not be true' }];
    }
};

describe('a failure condition', function() {
    it('triggers the next middleware with the error', function(done) {
        var middleware = validator({ body: failingValidation });

        var req = {
            body: {
                failingVal: true
            }
        };

        var next = function(err) {
            expect(err).to.be.ok;
            expect(err.fields.details[0].path).to.equal('failingVal');
            expect(err.fields.details[0].value).to.equal(true);
            expect(err.fields.details[0].message).to.equal('should not be true');
            expect(err.status).to.equal('InvalidSyntax');
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

describe('identical error messages to the old version', () => {
    var req = {};

    it('params', (done) => {
        var middleware = validator({ params: failingValidation });

        req.body = { body: {} };

        var next = function(err) {
            expect(err).to.be.ok;
            expect(err.message).to.equal('Invalid request parameters');
            done();
        };

        middleware(req, {}, next);
    });

    it('query', (done) => {
        var middleware = validator({ query: failingValidation });

        req.body = { body: {} };

        var next = function(err) {
            expect(err).to.be.ok;
            expect(err.message).to.equal('Invalid query string');
            done();
        };

        middleware(req, {}, next);
    });

    it('body', (done) => {
        var middleware = validator({ body: failingValidation });

        req.body = { body: {} };

        var next = function(err) {
            expect(err).to.be.ok;
            expect(err.message).to.equal('Invalid request payload');
            done();
        };

        middleware(req, {}, next);
    });
});
