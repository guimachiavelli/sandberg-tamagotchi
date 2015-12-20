'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Button = function Button(name, action) {
    _classCallCheck(this, Button);

    this.el = document.createElement('button');
    this.el.innerHTML = name;
    this.el.type = 'button';
    this.el.dataset.action = action;
};

var Interface = (function () {
    function Interface(pubsub) {
        _classCallCheck(this, Interface);

        this.interface = this.container();
        this.feedButton = new Button('Feed', 'feed');
        this.addButtonToContainer(this.feedButton);

        this.pubsub = pubsub;

        this.bind();
    }

    _createClass(Interface, [{
        key: 'bind',
        value: function bind() {
            this.interface.addEventListener('click', this.onClick.bind(this));
        }
    }, {
        key: 'container',
        value: function container() {
            var el = document.createElement('div');
            el.className = 'interface';

            return el;
        }
    }, {
        key: 'addButtonToContainer',
        value: function addButtonToContainer(button) {
            this.interface.appendChild(button.el);
        }
    }, {
        key: 'render',
        value: function render() {
            document.body.appendChild(this.interface);
        }
    }, {
        key: 'onClick',
        value: function onClick(e) {
            var target = e.target;

            if (target.nodeName !== 'BUTTON') {
                return;
            }

            this.pubsub.publish('action:' + target.dataset.action);
        }
    }]);

    return Interface;
})();

exports.default = Interface;
