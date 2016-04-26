'use strict';

var expect = require('chai').expect;
var middleware = require('../index');
var fixtures = require('./fixtures.js');

var AREAS = ['params', 'query', 'body', 'headers'];

describe('creating the middleware', function() {

    it('throws if no matchers are provided', function() {
        expect(function() {
            middleware({});
        }).to.throw(/at least one/);
    });

    it('works if validating a single area', function() {
        AREAS.forEach(function(area) {
            var checks = {};
            checks[area] = fixtures.success();
            expect(function() {
                middleware(checks);
            }).not.to.throw(/at least one/);
        });
    });

    it('works if validating all areas', function() {
        var checks = {};
        AREAS.forEach(function(area) {
            checks[area] = fixtures.success();
        });
        expect(function() {
            middleware(checks);
        }).not.to.throw(/at least one/);
    });

    it('throws if the checks are not valid matchers', function() {
        AREAS.forEach(function(area) {
            var checks = {};
            checks[area] = fixtures.invalid();
            expect(function() {
                middleware(checks);
            }).to.throw(/should be a valid matcher/);
        });
    });

});

describe('middleware validation', function() {

    it('validates a failing body', function() {
        var req = {
            body: 'foo'
        };
        var validate = middleware({ body: fixtures.failure() });
        validate(req, {}, function(err) {
            expect(err).to.be.ok;
            expect(err.message).to.equal('Invalid request payload');
            expect(err.details).to.eql([{
                path: 'body',
                value: 'foo',
                message: 'should not be foo'
            }]);
        });
    });

    it('validates a matching body', function() {
        var req = {
            body: 'foo'
        };
        var validate = middleware({ body: fixtures.success() });
        validate(req, {}, function(err) {
            expect(err).to.be.falsy;
        });
    });

    it('calls all checks if they pass (params, query, body, headers)', function() {
        var req = {
            body: {}
        };
        var spy = fixtures.spy();
        var validate = middleware({
            params: spy,
            query: spy,
            body: spy,
            headers: spy
        });
        validate(req, {}, function(err) {
            expect(err).to.be.falsy;
            expect(spy.count()).to.equal(4);
        });
    });

    it('collects all errors and reports them in one error', function() {
        var req = {
            params: 'p',
            query: 'q',
            body: 'b',
            headers: 'h'
        };
        var validate = middleware({
            params: fixtures.failure(),
            query: fixtures.failure(),
            body: fixtures.failure(),
            headers: fixtures.failure()
        });
        validate(req, {}, function(err) {
            expect(err).to.be.ok;
            expect(err.message).to.equal('There were combined errors in params, query, body, headers.');

            Object.keys(req).forEach(function(area, i){
                expect(err.details[i].path).to.equal(area);
                expect(err.details[i].value).to.equal(req[area]);
                expect(err.details[i].message).to.equal('should not be ' + req[area]);
            });
        });
    });

    it('elegantly copes with interspersed failures', function() {
        var req = {
            params: 'p',
            query: 'q',
            body: 'b',
            headers: 'h'
        };
        var validate = middleware({
            params: fixtures.failure(),
            query: fixtures.success(),
            body: fixtures.success(),
            headers: fixtures.failure()
        });
        validate(req, {}, function(err) {
            expect(err).to.be.ok;
            expect(err.message).to.equal('There were combined errors in params, headers.');

            expect(err.details[0].path).to.equal('params');
            expect(err.details[0].value).to.equal('p');
            expect(err.details[0].message).to.equal('should not be p');

            expect(err.details[1].path).to.equal('headers');
            expect(err.details[1].value).to.equal('h');
            expect(err.details[1].message).to.equal('should not be h');
        });
    });
  });

  describe('setting validation areas', function() {
    beforeEach(function() {
      middleware.setValidationArea('jwt', 'Invalid JWT');
    });

    afterEach(function() {
      middleware.setValidationArea('jwt', undefined);
    });

    it('can handle custom areas failing', function() {
        middleware.setValidationArea('jwt', 'Invalid JWT');
        var req = {
            jwt: 'foo'
        };
        var validate = middleware({ jwt: fixtures.failure() });
        validate(req, {}, function(err) {
            expect(err).to.be.ok;
            expect(err.message).to.equal('Invalid JWT');
            expect(err.details).to.eql([{
                path: 'jwt',
                value: 'foo',
                message: 'should not be foo'
            }]);
        });
    });

    it('can handle custom areas succeeding', function() {
      var req = {
          jwt: 'foo'
      };
      var validate = middleware({ jwt: fixtures.success() });
      validate(req, {}, function(err) {
          expect(err).to.be.falsy;
      });
    });
});
