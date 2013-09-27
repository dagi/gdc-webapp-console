(function(App) {
    App.backend = '/gdcwebapp/management/jmx/';

    App.JolokiaFactory = Ember.Object.create({
        basic: function(path) {
            if (!path) path = '';
            else if (path[0] !== '/') path = '/' + path;

            return new Jolokia(App.backend + path);
        },

        cubism: function() {
            return cubism.context()
                .serverDelay(0)
                .clientDelay(0)
                .step(1000)
                .size(594);
        },

        cubistic: function(path) {
            if (!path) path = '';
            else if (path[0] !== '/') path = '/' + path;

            var context = this.cubism();
            var jolokia = this.basic(path);
            var cubistic = context.jolokia(jolokia);

            cubistic.j4p = jolokia;
            cubistic.cubism = context;

            return cubistic;
        }
    });
})(window.App);
