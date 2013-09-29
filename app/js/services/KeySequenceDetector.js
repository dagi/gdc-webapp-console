(function(App) {
    App.KeySequenceDetector = Ember.Object.extend(Ember.Evented, {

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
        sequence: null,

        /**
         * Number of seconds to wait for the next key to be pressed.
         * 
         * @property {Number}
         */
        keyDelay: 2000,

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
                sequence = this.get('sequence'),
                expectedKey = sequence[currentKeyIndex + 1];

            return expectedKey;
        }.property('_currentKeyIndex'),

        _started: function() {
            return this.get('_currentKeyIndex') > -1;
        }.property('_currentKeyIndex').readOnly(),

        _isKeySequenceComplete: function() {
            return this.get('_currentKeyIndex') === this.get('sequence.length') - 1;
        }.property('_currentKeyIndex'),

        _onKeyInput: function(event) {
            var charCode = event.which,
                char = String.fromCharCode(charCode).toLowerCase(),
                isValidTarget = !event.target.tagName.match(/input|textarea|select/gi);

            if (!isValidTarget) return;

            if (this.get('_expectsKey') === char) {
                this.incrementProperty('_currentKeyIndex');
            } else {
                this.trigger('error', {key: char});
                this._clearKeySequence();
            }

            this._resetTimer();
        },

        _isKeySequenceCompleteDidChange: function() {
            if (this.get('_isKeySequenceComplete')) {
                this.trigger('complete');

                this._clearKeySequence();
            }
        }.observes('_currentKeyIndex'),

        _clearKeySequence: function() {
            this.set('_currentKeyIndex', -1);
        },

        _clearTimer: function() {
            clearTimeout(this.get('_timer'));
            this.set('_timer', null);
        },

        _resetTimer: function() {
            this._clearTimer();

            var timer = setTimeout(this._clearKeySequence.bind(this), this.get('keyDelay'));
            this.set('_timer', timer);
        },

        start: function() {
            if (this.get('_started')) return;

            this._clearKeySequence();

            $(window).on('keypress', this._onKeyInput.bind(this));
        },

        stop: function() {
            this._clearTimer();

            $(window).off('keypress', this._onKeyInput);
        },

        reset: function() {
            this._clearKeySequence();
            this._clearTimer();
        },

        destroy: function() {
            this._super();

            this.stop();
        }
    });
})(window.App);
