(function(Router) {
    'use strict';

    Router.map(function() {
        this.route('logging', {path: '/logging'});
        this.route('cache', {path: '/cache'});

        this.resource('monitoring', {path: '/monitoring'}, function() {
            this.route('native', {path: 'native'});
            this.route('embedded', {path: 'embedded'});
        });
    });
})(window.App.Router);
