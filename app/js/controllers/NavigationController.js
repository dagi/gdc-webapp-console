(function(App) {
    App.NavigationController = Ember.ArrayController.extend({
        content: [
            {label: 'Management', url: 'management', children: [
                {label: 'Logging', url: 'logging'},
                {label: 'Clear JBoss cache', url: 'cache'}
            ]},
            {label: 'Monitoring', url: 'monitoring'}
        ]
    });
})(window.App);
