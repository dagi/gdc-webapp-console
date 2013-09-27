(function(App) {
    App.ErrorView = Ember.View.extend({

        displayedError: null,

        _errorDidChange: function() {
            var error = this.get('controller.content');
            var promise = this.hideError().then(this.set.bind(this, 'displayedError', error));

            if (error) promise.then(this.showError.bind(this));
        }.observes('controller.content'),

        didInsertElement: function() {
            this._super();

            if (!this.get('controller.content')) this.$().hide();
        },

        showError: function() {
            var $el = this.$();

            if (!$el) return $.Deferred().resolve().promise();
            else return this.$().animate({
                opacity: 1,
                height: 'show'
            }, {
                queue: false,
                duration: 300
            }).promise();
        },

        hideError: function() {
            var $el = this.$();

            if (!$el) return $.Deferred().resolve().promise();
            else return this.$().animate({
                opacity: 0,
                height: 'hide'
            }, {
                queue: false,
                duration: 300
            }).promise();
        }
    });
})(window.App);
