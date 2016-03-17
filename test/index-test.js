'use strict';

var expect          = require('chai').expect,
    validator       = require('./../index');

//describe('');

describe('bad input', () => {
    it('returns an empty middleware if the validation is falsely', () => {
        expect(typeof validator()).to.equal('function');
        let middleware = validator();
        let called = false;
        let next = () => {
            called = true;
        };

        middleware(null, null, next);
        expect(called).to.be.true;
    });
});
