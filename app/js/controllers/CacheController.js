(function(App) {
    App.CacheController = Ember.Controller.extend({

        loading: false,

        error: null,

        cannotSubmitBinding: Ember.Binding.oneWay('loading'),

        actions: {
            clear: function() {
                if (this.get('cannotSubmit')) return false;

                var j4p = App.JolokiaFactory.basic(),
                    mbean = 'com.gooddata:name=WebappCacheManager',
                    operation = 'clearAll';

                j4p.execute(mbean, operation, {
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
