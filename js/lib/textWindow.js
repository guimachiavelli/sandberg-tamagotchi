'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextWindow = (function () {
    function TextWindow(pubsub) {
        _classCallCheck(this, TextWindow);

        this._el = document.createElement('div');
        this._el.className = 'text-window';
        this.pubsub = pubsub;
        this.subscribe();
    }

    _createClass(TextWindow, [{
        key: 'render',
        value: function render(context) {
            context.appendChild(this._el);
        }
    }, {
        key: 'update',
        value: function update(textString) {
            var paragraph = document.createElement('p');
            paragraph.innerHTML = textString;

            this._el.appendChild(paragraph);
        }
    }, {
        key: 'subscribe',
        value: function subscribe() {
            this.pubsub.subscribe('text:add', this.update.bind(this));
        }
    }]);

    return TextWindow;
})();

exports.default = TextWindow;
