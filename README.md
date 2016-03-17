
A function that generates a middleware `function(req, res, next)` closure around validation logic that supports the 
validation contract from (strummer)[https://github.com/TabDigital/strummer].

For more detailed explanation as to why a new version of validating middleware was needed see the Background below.

This library was written to be compatible with earlier versions of Node.

## Install

Assuming you have Github access to the TabDigital organisation.

`npm install api-middleware-validation`. 

## Background 
  
This was written because an (earlier version)[https://github.com/TabDigital/api-middleware] of validating middleware contained its own copy of strummer. 

This resulted in confusion about which version of strummer was being used at a particular moment in a program. Also, please 
note that strummer was deliberately *NOT* included in package.json as a dependency, peerDependency or devDependency. TABDigital 
supports many different versions of Node, so finding dependency behaviour that was consistent across them to make strummer 
default to the host application's dependency wasn't possible.

The contract is specifically meant to match (strummer)[https://github.com/TabDigital/strummer] but any other function that supports the same contract will work as well.

The extent of Strummer's validation contract for this middleware lib.

The contract

* supports a one arity function called `match`. Strummer's matcher is actually two arity but can work with one - which, for us, is an area in the HTTP request - `['params', 'query', 'body']` .
* return an empty array if validation was successful.
* returns a non-empty array if the validation failed.

The legacy validator used to return a generic InvalidSyntax error if the array was non-empty, without parsing Strummer's validation failure messages. 

So, this library's concern is only to spot a generic fail condition and trigger an error condition in the middleware.

