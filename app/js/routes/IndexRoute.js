(function(App) {
    App.IndexRoute = Ember.Route.extend({
        redirect: function() {
            // TODO
            this.transitionTo('logging');
        }
    });
})(window.App);
