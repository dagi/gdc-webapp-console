// Copyright (C) 2007-2012, GoodData(R) Corporation. All rights reserved.
var express = require("express"),
    fs = require('fs'),
    httpProxy = require('http-proxy'),
    https = require('https'),
    middleware = require('./middleware');

/**
 * Run server which works as proxy for backend calls to GoodData
 * and serves static files.
 *
 * Options:
 *   documentRoot  Path to the document root of GoodData bear
 *   port          Local port where should server run
 *   backendHost   GoodData backend host name
 *   stubFilePath  Path to stub script used to bend Grizzly
 *   success       Callback executed when Grizzly starts listening
 *   portInUse     Callback executed when passed port is already in use
 *
 * @param {Object} options  Parameters
 */
exports.run = function(options) {
    var certDir = __dirname + '/../cert',
        documentRoot = options.documentRoot,
        port = options.port,
        backendHost = options.backendHost,
        stubFilePath = options.stubFilePath,
        app = createApp(documentRoot, backendHost, stubFilePath),
        server;

    // Create HTTPS local server
    server = https.createServer({
        key: fs.readFileSync(certDir + '/server.key', 'utf8'),
        cert: fs.readFileSync(certDir + '/server.crt', 'utf8')
    }, app).listen(port);

    // Turn possible errors into human-readable messages
    server.on('error', function(e) {
        if (e.code == 'EADDRINUSE') {
            options.portInUse.apply(this);
        }
    });

    // When server starts successfully, call onListening
    server.on('listening', options.success);
};

/**
 * Setup a server which routes backend requests to some remote backend
 * specified by host name and serves static files in passed document root.
 * All tighly bound to GoodData client app.
 *
 * @param {String} documentRoot Path to the document root of GoodData bear
 * @param {String} backendHost  GoodData backend host name
 * @param {String} [stubFilePath] Path to stub script used to bend Grizzly
 * @return {Object}  Express.js application object
 */
function createApp(documentRoot, backendHost, stubFilePath) {
    var app = express(),
        stubFn = stubFilePath && require(stubFilePath).stub;

    // First use user defined stub
    stubFn && stubFn(app);

    // Strip domain from set-cookie headers so GoodData works also
    // at different domain than the set one (at i.e. localhost)
    app.use(middleware.setCookieDomainStripper());
    app.use(express.methodOverride());
    app.use(express.bodyParser());

    // Setup proxy to backend
    var proxy = new httpProxy.RoutingProxy({
        target: {
            https: true
        }
    });

    function proxyToBackend(req, res) {
        // Because backend does not answer without set content length
        // It might get deleted when subsequent pull request gets merged
        // @see https://github.com/nodejitsu/node-http-proxy/pull/338
        if (req.method === 'DELETE') {
            req.headers['content-length'] = '0';
        }

        // White labeled resources are based on host header
        req.headers['host'] = backendHost;

        proxy.proxyRequest(req, res, {
            host: backendHost,
            port: 443,
            target: {
                // don't choke on self-signed certificates used by *.getgooddata.com
                rejectUnauthorized: false
            }
        });
    }

    // Add routes which should be proxied to backend
    app.all('/gdc*', proxyToBackend);
    app.all('/wmc*', proxyToBackend);
    app.all('/gdc_img*', proxyToBackend);
    app.all('/captcha*', proxyToBackend);
    app.all('/projectTemplates*', proxyToBackend);

    // Serving DISABLED_TESTS as text/plain - test/runTests.html is dependent on it
    app.all('/test/DISABLED_TESTS', function(req, res, next) {
        res.header('Content-Type', 'text/plain');
        next();
    });

    // Configure directory listing in test directory
    // app.use('/test', express.directory(documentRoot + '/test'));

    // Set cache behaviour useful for development
    app.use('/scripts', function(req, res, next) {
        res.header('Cache-Control', 'max-age=0, must-revalidate');
        next();
    });

    // Configure handling of static files in bear's document
    app.use(express.static(documentRoot));

    return app;
}
