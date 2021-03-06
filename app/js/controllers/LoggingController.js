(function(App) {
    App.LoggingController = Ember.Controller.extend({

        levels: [
            {label: 'Warning', value: 'WARN'},
            {label: 'Info', value: 'INFO'},
            {label: 'Error', value: 'ERROR'},
            {label: 'Debug', value: 'DEBUG'}
        ],

        error: null,

        clearOnSuccess: false,

        level: null,

        key: null,

        loading: false,

        idle: Ember.computed.not('loading'),

        canSubmit: Ember.computed.and('key', 'level', 'idle'),

        cannotSubmit: Ember.computed.not('canSubmit'),

        actions: {
            submit: function() {
                if (this.get('cannotSubmit')) return false;

                var j4p = App.JolokiaFactory.basic(),
                    mbean = 'ch.qos.logback.classic:Name=default,Type=ch.qos.logback.classic.jmx.JMXConfigurator',
                    operation = 'setLoggerLevel',
                    key = this.get('key'),
                    level = this.get('level');

                j4p.execute(mbean, operation, key, level, {
                    success: this._onSuccess.bind(this),
                    error: this._onError.bind(this),
                    ajaxError: this._onAjaxError.bind(this)
                });

                this.set('loading', true);
            },

            clearLastError: function() {
                this.set('lastError', null);
            }
        },

        _onSuccess: function() {
            this.set('loading', false);
            this.set('error', null);

            if (this.get('clearOnSuccess')) this.set('key', null);
        },

        _onAjaxError: function() {
            this.set('loading', false);
            this.set('error', 'HTTP error occured. There is no point in trying again');
        },

        _onError: function(error) {
            this.set('loading', false);
            this.set('error', ('Backend error occured: <strong>' + error.error + '</strong>').htmlSafe());
        }
    });
})(window.App);
