# Strummer-Middleware

[![NPM](http://img.shields.io/npm/v/strummer.svg?style=flat-square)](https://npmjs.org/package/strummer-middleware)
[![License](http://img.shields.io/npm/l/node-strummer-middleware.svg?style=flat-square)](https://github.com/TabDigital/node-strummer-middleware)

[![Build Status](https://travis-ci.com/TabDigital/node-strummer-middleware.svg?token=RfpP7WAYQqnR4gnFRm4r&branch=master)](https://travis-ci.com/TabDigital/node-strummer-middleware)

## Description

Wraps your [strummer](https://github.com/TabDigital/strummer) validation logic into middleware ready for a HTTP request!

## Usage

Strummer-middleware was built to be used with [strummer](https://github.com/TabDigital/strummer) but any other function supporting  a `match` function with an arity of one will work too (see below in [Strummer Contract](https://github.com/TabDigital/node-strummer-middleware/tree/master#stummer-contract)).

It simply exports a function that generates a middleware `function(req, res, next)` closure around a `match`. 

For example:

```
var s = require('strummer');
var sMiddleware = require('strummer-middleware');

var validation = sMiddleware(s({ body: { transactionId: new s.uuid(), accountId: 'string' }}));
```

In the above, the middleware will look for a `body` property on the request (to validate a HTTP POST). Other valid areas 
to validate are `query` and `params`. 

In [Express](http://expressjs.com/) this means you will also need to set up an error handler to control the error.

```
server.post('/accounts/:accountId/deposit', validation, errorHandler, controller.create)
```

If a validation error occurs, the `next` callback in the middleware will be passed an `InvalidSyntaxError` (see `/lib/invalid-syntax-error`). 

The `InvalidSyntaxError` inherits from an error representing a HTTP status code of 400. It is expected that your error handler will intercept this error to whatever it needs.

Validation error information is held within the `err.fields` property for your error handler to access.

## Install

Assuming you have Github access to the TabDigital organisation.

`npm install api-middleware-validation`. 

## Background 

This library was written to be compatible with most versions of Node.
 
It is a rewrite of an earlier internal TAB library and was written not to contain its own copy of strummer. 

This resulted in confusion about which version of strummer was being used at a particular moment in a program. Also, please 
note that strummer was deliberately *NOT* included in package.json as a dependency, peerDependency or devDependency. TABDigital 
supports many different versions of Node, so finding dependency behaviour that was consistent across them to make strummer 
default to the host application's dependency wasn't possible.

The extent of Strummer's validation contract for this middleware lib.

## Stummer contract

The contract

* supports a one arity function called `match`. Strummer's matcher is actually two arity but can work with one - which, for us, is an area in the HTTP request - `['params', 'query', 'body']` .
* return an empty array if validation was successful.
* returns a non-empty array if the validation failed.

