(function(App) {
    App.backend = '/gdcwebapp/management/jmx/';

    App.JolokiaFactory = Ember.Object.create({
        basic: function(path) {
            if (!path) path = '';
            else if (path[0] !== '/') path = '/' + path;

            return new Jolokia(App.backend + path);
        },

        cubistic: function(context, path) {
            if (!path) path = '';
            else if (path[0] !== '/') path = '/' + path;

            var jolokia = this.basic(path);
            var cubistic = context.jolokia(jolokia);

            return cubistic;
        }
    });
})(window.App);
