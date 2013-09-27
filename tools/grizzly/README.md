# Grizzly

    ()---()
    ( ^_^ )

Lightweight node.js-based server which proxies backend calls to GoodData backend server and serves local content. Useful for development.

## Run

Start it in bear.git/client by

    $ rake server

## Tricky stuff

Server listens only for HTTPS requests. Therefore `http://localhost:8443/` does not respond with anything. You must use URL with HTTPS: `https://localhost:8443/`

If you are bothered by having to constantly accept the self-signed certificate, you can add it manually to your Mac keychain. To do so, click the lock icon in chrome
address bar, go to certificate information and drag the certificate icon to your desktop. Then add it to your system keychain by doubleclicking it. After that
doubleclick it the item in the list, expand "Trust" and select "Always trust" from the "Secure Sockets Layer (SSL)" dropdown.

## Requirements

Installed [node.js](http://nodejs.org/).

## Specifying your own port and backend

By default server uses port 8443 and proxies to secure.gooddata.com. You can override these default settings using environment variables port and backend.
(GDPORT and GDBACKEND variables still work, but are deprecated).

    $ rake server port=8118 backend=na1.gooddata.com

## Output

When server starts, it only shows at which port it runs on and where does it proxies backend requests.

    $ rake server
      ()---()  Using backend secure.gooddata.com
      ( ^_^ )  Starting webserver at https://localhost:8443/

## Stubbing unusual server behavior

Have you ever been fixing bug caused by XHR returning some obscure HTTP code like `418 I'm a teapot`?

You can stub this behavior (and any other) by creating stub script in `tools/grizzly_stubs` and
specifying what it should do. There is a template stub `tools/grizzly_stubs/template.js` which
just injects custom header to bootstrap resource HTTP response. Find inspiration there.

When your stub script is ready, just pass it to grizzly:

    $ rake server stub=yourstubscriptname

The template stub script can therefore be executed like this:

    $ rake server stub=template

For advanced behaviors see [express.js](http://expressjs.com/) documentation as Grizzly is written using it.

## Why does Grizzly looks so cute?

Do you REALLY want to find out why? It's a Grizzly. G. R. I. Z. Z. L. Y. Really?

Me neither.
