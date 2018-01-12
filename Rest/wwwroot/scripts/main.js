requirejs.config({
    baseUrl: "scripts",
    paths: {
        ko: "../lib/knockout/dist/knockout",
        lodash: "../lib/lodash/dist/lodash",
        domReady: '../lib/requirejs-domReady/domReady',
        restangular: '../lib/restangular/dist/restangular',
        jquery: "../lib/jquery/dist/jquery",
        q: "../lib/q/q",
        "collections/shim": "../lib/es6-shim/es6-shim"
    }
});

requirejs(["domReady", "application"]);