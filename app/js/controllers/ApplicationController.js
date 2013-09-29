(function(App) {
    App.ApplicationController = Ember.Controller.extend({

        error: null,

        isOverlayDisplayed: false,

        _showOverlay: function() {
            this.set('isOverlayDisplayed', true);
            setTimeout(this._hideOverlay.bind(this), 20000);
        },

        _hideOverlay: function() {
            this.set('isOverlayDisplayed', false);
        },

        actions:{
            gooddataSequenceComplete: function() {
                this._showOverlay();
            },

            ponySequenceComplete: function() {
                this._showOverlay();
            }
        }
    });
})(window.App);
