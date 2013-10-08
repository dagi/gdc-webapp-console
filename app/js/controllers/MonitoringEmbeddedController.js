(function(App) {
    App.MonitoringEmbeddedController = Ember.Controller.extend({

        iframeUrl : function() {
            if(window.location.hostname == "localhost" && window.location.port == 8080) {
                //this is intended for Java developers running stand-alone Tomcat with management-console
                return "hystrix-dashboard/monitor/monitor.html?stream=http%3A%2F%2Flocalhost%3A8080%2Fturbine.stream%3Fcluster%3DWebappHystrixCluster";
            }
            return "hystrix-dashboard/monitor/monitor.html?stream=http%3A%2F%2Flocalhost%3A8080%2Fmanagement-console%2Fturbine.stream%3Fcluster%3DWebappHystrixCluster";
        }.property()
    });
})(window.App);
