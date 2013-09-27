(function(App) {
    App.ErrorController = Ember.ObjectController.extend({
        content: null,

        actions: {
            clearLastError: function() {
                this.set('content', null);
            }
        },
    });
})(window.App);
