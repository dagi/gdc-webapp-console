(function(App) {
    App.ApplicationView = Ember.View.extend({

        /**
         * Timer that is involved in extra functionality
         * It shuts down character sequence detection.
         * After a key has been put down, this timer is reset.
         * If it hits zero, current sequence is reset.
         *
         * @property {Pointer}
         */
        _timer: null,

        /**
         * Character sequence that, when put down on keyboard
         * fires `keySequenceComplete` action on controller
         *
         * @property {String}
         */
        _keySequence: 'gooddata',

        /**
         * Current sequence progess.
         * Index of current character in _keySequence string
         *
         * @property {Number}
         */
        _currentKeyIndex: -1,

        /**
         * Char that is expected as next character to be put down
         *
         * @property {Char}
         */
        _expectsKey: function() {
            var currentKeyIndex = this.get('_currentKeyIndex'),
                sequence = this.get('_keySequence'),
                expectedKey = sequence[currentKeyIndex + 1];

            return expectedKey;
        }.property('_currentKeyIndex'),

        _isKeySequenceComplete: function() {
            return this.get('_currentKeyIndex') === this.get('_keySequence.length') - 1;
        }.property('_currentKeyIndex'),

        _onKeyInput: function(event) {
            var charCode = event.which,
                char = String.fromCharCode(charCode).toLowerCase(),
                isValidTarget = !event.target.tagName.match(/input|textarea|select/gi);

            if (!isValidTarget) return;

            if (this.get('_expectsKey') === char) {
                this.incrementProperty('_currentKeyIndex');
            } else {
                this._clearKeySequence();
            }

            this._resetKeySequenceTimer();
        },

        _isKeySequenceCompleteDidChange: function() {
            if (this.get('_isKeySequenceComplete')) {
                this.get('controller').send('keySequenceComplete');

                this._clearKeySequence();
            }
        }.observes('_currentKeyIndex'),

        _clearKeySequence: function() {
            this.set('_currentKeyIndex', -1);
        },

        _resetKeySequenceTimer: function() {
            clearTimeout(this.get('_timer'));
            var timer = setTimeout(this._clearKeySequence.bind(this), 2000);

            this.set('_timer', timer);
        },

        didInsertElement: function() {
            this._super();

            $(window).on('keypress', this._onKeyInput.bind(this));
        },

        willDestroyElement: function() {
            this._super();

            $(window).off('keypress', this._onKeyInput);
        }
    });
})(window.App);
