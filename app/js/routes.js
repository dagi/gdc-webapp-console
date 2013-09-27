(function(Router) {
    'use strict';

    Router.map(function() {
        this.route('logging', {path: 'logging'});
        this.route('cache', {path: 'cache'});
        this.route('monitoring', {path: 'monitoring'});
    });
})(window.App.Router);
