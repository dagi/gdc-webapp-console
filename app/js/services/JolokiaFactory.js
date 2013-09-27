(function(App) {
    App.backend = '/gdcwebapp/management/jmx/';

    App.JolokiaFactory = Ember.Object.create({
        instance: function(path) {
            if (!path) path = '';
            else if (path[0] !== '/') path = '/' + path;

            return new Jolokia(App.backend + path);
        }
    });
})(window.App);
