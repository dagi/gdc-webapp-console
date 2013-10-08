(function(App) {
    App.MonitoringEmbeddedController = Ember.Controller.extend({

        iframeUrl : function() {
            return "hystrix-dashboard/monitor/monitor.html?stream=http%3A%2F%2Flocalhost%3A8080%2Fmanagement-console%2Fturbine.stream%3Fcluster%3DWebappHystrixCluster";
        }.property()
    });
})(window.App);
