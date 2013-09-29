(function(App) {
    App.NavigationController = Ember.ArrayController.extend({
        content: [
            {label: 'Management', children: [
                {label: 'Logging', url: '/logging'},
                {label: 'Clear JBoss cache', url: '/cache'}
            ]},
            {label: 'Monitoring', children: [
                {label: 'Hystrix', url: '/monitoring/embedded'},
                {label: 'Native', url: '/monitoring/native'}
            ]}
        ]
    });
})(window.App);
