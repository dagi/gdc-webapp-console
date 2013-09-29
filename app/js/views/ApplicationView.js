(function(App, KeySequenceDetector) {
    App.ApplicationView = Ember.View.extend({

        _gooddataSequenceDetector: null,

        _ponySequenceDetector: null,

        _gooddataSequenceComplete: function() {
            this.get('controller').send('gooddataSequenceComplete');
        },

        _ponySequenceComplete: function() {
            this.get('controller').send('ponySequenceComplete');
        },

        didInsertElement: function() {
            this._super();

            var gooddataSequenceDetector = KeySequenceDetector.create({ sequence: 'gooddata' });
            var ponySequenceDetector = KeySequenceDetector.create({ sequence: 'pony' });

            gooddataSequenceDetector.on('complete', this._gooddataSequenceComplete.bind(this));
            ponySequenceDetector.on('complete', this._ponySequenceComplete.bind(this));

            gooddataSequenceDetector.start();
            ponySequenceDetector.start();

            this.set('_gooddataSequenceDetector', gooddataSequenceDetector);
            this.set('_ponySequenceDetector', ponySequenceDetector);
        },

        willDestroyElement: function() {
            this._super();

            this.get('_gooddataSequenceDetector').destroy();
            this.get('_ponySequenceDetector').destroy();
        }
    });
})(window.App, window.App.KeySequenceDetector);
