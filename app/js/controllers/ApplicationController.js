(function(App) {
    App.ApplicationController = Ember.Controller.extend({

        error: null,

        isOverlayDisplayed: false,

        _showOverlay: function() {
            this.set('isOverlayDisplayed', true);
            setTimeout(this._hideOverlay.bind(this), 2000);
        },

        _hideOverlay: function() {
            this.set('isOverlayDisplayed', false);
        },

        actions:{
            keySequenceComplete: function() {
                this._showOverlay();
            }
        }
    });
})(window.App);
