'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PubSub = (function () {
    function PubSub() {
        _classCallCheck(this, PubSub);

        this._topics = {};
    }

    _createClass(PubSub, [{
        key: 'subscribe',
        value: function subscribe(event, listener) {
            if (this._topics[event] === undefined) {
                this._topics[event] = [];
            }

            if (this.listenerIndexInTopic(listener, event) >= 0) {
                console.warn('cannot subscribe: event already subscribed');
                return;
            }

            this._topics[event].push(listener);
        }
    }, {
        key: 'desubscribe',
        value: function desubscribe(event, listener) {
            var listenerIndex = this.hasListenerInTopic(listener, event);

            if (listenerIndex < 0) {
                console.warn('cannot desubscribe: listener not found');
                return;
            }

            this._topics[event].splice(listenerIndex, 1);
        }
    }, {
        key: 'publish',
        value: function publish(event) {
            var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var listeners = this._topics[event];
            listeners.forEach(function (listener) {
                listener(args);
            });
        }
    }, {
        key: 'listenerIndexInTopic',
        value: function listenerIndexInTopic(listener, topic) {
            var findListener = this.findListener.bind(this, listener);

            if (this._topics[topic] === undefined) {
                return -1;
            }

            return this._topics[topic].findIndex(findListener);
        }
    }, {
        key: 'findListener',
        value: function findListener(listener, subscribedListener) {
            if (listener === subscribedListener) {
                return true;
            }
            return false;
        }
    }]);

    return PubSub;
})();

exports.default = PubSub;
