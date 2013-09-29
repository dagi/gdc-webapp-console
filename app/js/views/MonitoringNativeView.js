(function(App, JolokiaFactory) {

    // Some graph color sets
    var colorsRed = ["#FDBE85", "#FEEDDE", "#FD8D3C", "#E6550D", "#A63603", "#FDBE85", "#FEEDDE", "#FD8D3C", "#E6550D", "#A63603" ],
        colorsGreen = [ "#E5F5F9", "#99D8C9", "#2CA25F", "#E5F5F9", "#99D8C9", "#2CA25F"],
        colorsBlue = [ "#ECE7F2", "#A6BDDB", "#2B8CBE", "#ECE7F2", "#A6BDDB", "#2B8CBE"];

    var createJolokia = function createJolokia() {
        // Create Cubism context
        var context = cubism.context()
            .serverDelay(0)
            .clientDelay(0)
            .step(1000);

        var jolokia = JolokiaFactory.cubistic(context);

        // Context is required further on
        jolokia.context = context;

        return jolokia;
    };

    App.MonitoringNativeView = Ember.View.extend({

        _jolokia: null,

        _memoryMetric: function() {
            var jolokia = this.get('_jolokia');

            if (!jolokia) return null;

            var metric = jolokia.metric(
                function (resp1, resp2) {
                    return Number(resp1.value) / Number(resp2.value);
                },
                {type:"read", mbean:"java.lang:type=Memory", attribute:"HeapMemoryUsage", path:"used"},
                {type:"read", mbean:"java.lang:type=Memory", attribute:"HeapMemoryUsage", path:"max"},
                'Heap Memory '
            );

            return metric;
        }.property('_jolokia').readOnly(),

        _requestsMetric: function() {
            var jolokia = this.get('_jolokia');

            if (!jolokia) return null;

            var metric = jolokia.metric(
                function (resp) {
                    var attrs = resp.value;
                    var sum = 0;
                    for (var key in attrs) {
                        sum += attrs[key].requestCount;
                    }
                    return sum;
                },
                {type: "read", mbean:"Catalina:j2eeType=Servlet,*", attribute:"requestCount"},
                {name: "Requests", delta: 10 * 1000}
            );

            return metric;
        }.property('_jolokia').readOnly(),

        _initializePlots: function() {
            // We don't want to initialize the plots twice
            if (this.get('_jolokia')) return;

            var jolokia = createJolokia();
            var context = jolokia.context.size(this.$().width());

            this.set('_jolokia', jolokia);

            var memoryMetric = this.get('_memoryMetric');
            var requestsMetric = this.get('_requestsMetric');

            d3.select('#heapMemory').insert('div').call(function (div) {
                div.append("div")
                    .attr("class", "axis")
                    .call(context.axis().orient("top"));

                div.selectAll(".horizon")
                    .data([memoryMetric])
                    .enter().append("div")
                    .attr("class", "horizon")
                    .call(
                    context.horizon()
                        .colors(colorsRed)
                        .format(d3.format(".4p"))
                );

                div.append("div")
                    .attr("class", "rule")
                    .call(context.rule());
            });


             d3.select('#requests').insert('div').call(function (div) {
                div.append("div")
                    .attr("class", "axis")
                    .call(context.axis().orient("top"));

                div.selectAll(".horizon")
                    .data([requestsMetric])
                    .enter()
                    .append("div")
                    .attr("class", "horizon")
                    .call(context.horizon()
                    .format(d3.format("10d"))
                    .colors(function (d, i) {
                        return i == 3 ? colorsBlue : colorsGreen;
                    }));

                div.append("div")
                    .attr("class", "rule")
                    .call(context.rule());
            });

            jolokia.start(1000);
        },

        _destroyPlots: function() {
            var jolokia = this.get('_jolokia');

            if (!jolokia) return;

            d3.select('#heapMemory').select('div').remove();
            d3.select('#requests').select('div').remove();

            jolokia.stop();
            this.set('_jolokia', null);
        },

        _windowDidResize: function() {
            this._destroyPlots();
            this._initializePlots();
        },

        didInsertElement: function() {
            this._super();

            $(window).on('resize', this._windowDidResize.bind(this));

            this._initializePlots();
        },

        willDestroyElement: function() {
            this._super();

            $(window).off('resize', this._windowDidResize);

            this._destroyPlots();
        }
    });
})(window.App, App.JolokiaFactory);
