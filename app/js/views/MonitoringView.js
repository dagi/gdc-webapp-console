(function(App, JolokiaFactory) {
    App.MonitoringView = Ember.View.extend({

        _cubistic: null,

        didInsertElement: function() {
            this._super();

            var cubistic = JolokiaFactory.cubistic();
            var context = cubistic.cubism.size(800);

            this.set('cubistic', cubistic);

            var memory = cubistic.metric(
                function (resp1, resp2) {
                    return Number(resp1.value) / Number(resp2.value);
                },
                {type:"read", mbean:"java.lang:type=Memory", attribute:"HeapMemoryUsage", path:"used"},
                {type:"read", mbean:"java.lang:type=Memory", attribute:"HeapMemoryUsage", path:"max"},
                'Heap Memory '
            );

            var allRequests = cubistic.metric(
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

            var colorsRed = ["#FDBE85", "#FEEDDE", "#FD8D3C", "#E6550D", "#A63603", "#FDBE85", "#FEEDDE", "#FD8D3C", "#E6550D", "#A63603" ],
                colorsGreen = [ "#E5F5F9", "#99D8C9", "#2CA25F", "#E5F5F9", "#99D8C9", "#2CA25F"],
                colorsBlue = [ "#ECE7F2", "#A6BDDB", "#2B8CBE", "#ECE7F2", "#A6BDDB", "#2B8CBE"];

            d3.select('#heapMemory').call(function (div) {
                div.append("div")
                    .attr("class", "axis")
                    .call(context.axis().orient("top"));

                div.selectAll(".horizon")
                    .data([memory])
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


             d3.select('#requests').call(function (div) {

                div.append("div")
                    .attr("class", "axis")
                    .call(context.axis().orient("top"));


                div.selectAll(".horizon")
                    .data([allRequests])
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

            cubistic.start(1000);
        },

        willDestroyElement: function() {
            this._super();

            this.get('cubistic').stop();
        }
    });
})(window.App, App.JolokiaFactory);
