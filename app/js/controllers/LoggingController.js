(function(App) {
    App.LoggingController = Ember.ObjectController.extend({
        loggingOptions: [
            {label: 'Warning', value: 'warn'},
            {label: 'Info', value: 'info'},
            {label: 'Error', value: 'error'},
            {label: 'Debug', value: 'debug'}
        ],

        message: null,

        actions: {
            submit: function() {
                // TODO
                console.log('submitting');
            }
        }
    });
})(window.App);
