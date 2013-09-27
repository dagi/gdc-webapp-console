// Copyright (C) 2007-2013, GoodData(R) Corporation. All rights reserved.

/**
 * Middleware which strips domain part from Set-Cookie headers to
 * allow usage of cookies also at different domain than the original
 * one.
 *
 * Useful when proxying backend from e.g. secure.gooddata.com, and
 * using client at localhost.
 *
 * @return {Function}
 */
exports.setCookieDomainStripper = function() {
    return function setCookieDomainStripper(req, res, next) {
        var writeHead = res.writeHead;

        res.writeHead = function(statusCode, headers) {
            // headers['set-cookie'] is an array of set-cookie strings
            if (headers && headers['set-cookie'] && headers['set-cookie'].length) {
                headers['set-cookie'] = headers['set-cookie'].map(function(setCookieHeader) {
                    return setCookieHeader.replace(/(domain=[^ ]+; )/mg, '');
                });
            }

            res.writeHead = writeHead;
            res.writeHead.apply(this, [statusCode, headers]);
        };

        next();
    }
};
