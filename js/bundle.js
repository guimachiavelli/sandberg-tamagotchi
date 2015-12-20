(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _interface = require('./interface.js');

var _interface2 = _interopRequireDefault(_interface);

var _tama = require('./tama.js');

var _tama2 = _interopRequireDefault(_tama);

var _textWindow = require('./textWindow.js');

var _textWindow2 = _interopRequireDefault(_textWindow);

var _pubsub = require('./pubsub.js');

var _pubsub2 = _interopRequireDefault(_pubsub);

var _settings = require('./settings.js');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = (function () {
    function Game() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? { width: 500, height: 500 } : arguments[0];

        _classCallCheck(this, Game);

        this.pixelDensity = options.pixelDensity || 1;
        this.width = options.width * this.pixelDensity;
        this.height = options.height * this.pixelDensity;

        this.stage = this.canvas();
        this.context = this.stage.getContext('2d');
        this.running = false;

        this.pubsub = new _pubsub2.default();
        this.tama = new _tama2.default(this.pubsub);
        this.interface = new _interface2.default(this.pubsub);
        this.textWindow = new _textWindow2.default(this.pubsub);
    }

    _createClass(Game, [{
        key: 'setup',
        value: function setup() {
            this.interface.render();
            this.textWindow.render(document.body);
            this.pubsub.subscribe('action:die', this.end.bind(this));
        }
    }, {
        key: 'start',
        value: function start() {
            this.running = true;
            this.update();
        }
    }, {
        key: 'update',
        value: function update() {
            if (this.running === false) {
                return;
            }
            this.tama.update();

            this.draw();
            window.requestAnimationFrame(this.update.bind(this));
        }
    }, {
        key: 'canvas',
        value: function canvas() {
            var el = document.createElement('canvas');
            el.className = 'stage';
            el.width = this.width;
            el.height = this.height;

            el.style.width = this.width / window.devicePixelRatio + 'px';
            el.style.width = this.height / window.devicePixelRatio + 'px';

            document.body.appendChild(el);

            return el;
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.context.clearRect(0, 0, this.width, this.height);
            this.tama.draw(this.context);
        }
    }, {
        key: 'end',
        value: function end() {
            this.running = false;
        }
    }, {
        key: 'log',
        value: function log(args) {
            console.log('log', args);
        }
    }]);

    return Game;
})();

var game = new Game({
    width: _settings2.default.width,
    height: _settings2.default.height,
    pixelDensity: _settings2.default.pixelDensity
});

game.setup();
game.start();

},{"./interface.js":1,"./pubsub.js":3,"./settings.js":4,"./tama.js":5,"./textWindow.js":6}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var settings = {
    width: 500,
    height: 500,
    pixelDensity: window.devicePixelRatio || 1
};

Object.freeze(settings);

exports.default = settings;

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _settings = require('./settings.js');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Strand = (function () {
    function Strand() {
        _classCallCheck(this, Strand);

        this.x1 = this.randomValue(2);
        this.y1 = this.randomValue(2);

        this.control1x = this.randomValue(2);
        this.control1y = this.randomValue(2);

        this.control2x = this.randomValue(2);
        this.control2y = this.randomValue(2);

        this.x2 = this.randomValue(200);
        this.y2 = this.randomValue(200);

        this.colour = this.randomColour();
    }

    _createClass(Strand, [{
        key: 'update',
        value: function update() {
            this.control1x += this.randomValue();
            this.control2x += this.randomValue();
            this.control1y += this.randomValue();
            this.control2y += this.randomValue();

            this.x2 += this.randomValue();
            this.y2 += this.randomValue();

            if (this.isAtBoundary(this.x2, 'width') === true) {
                this.x2 = this.randomValue();
            }

            if (this.isAtBoundary(this.y2, 'height') === true) {
                this.y2 = this.randomValue();
            }
        }
    }, {
        key: 'isAtBoundary',
        value: function isAtBoundary(value, dimension) {
            if (dimension !== 'width' && dimension !== 'height') {
                console.warn('strand:boundary: invalid dimension');
                return false;
            }

            return value >= _settings2.default[dimension] || value <= 0;
        }
    }, {
        key: 'startingPoint',
        value: function startingPoint() {
            return [this.x1, this.y1];
        }
    }, {
        key: 'bezierPoints',
        value: function bezierPoints() {
            return [this.control1x, this.control1y, this.control2x, this.control2y, this.x2, this.y2];
        }
    }, {
        key: 'randomValue',
        value: function randomValue() {
            var max = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];

            var value = Math.random() * max,
                direction = Math.random() > 0.45 ? 1 : -1;

            return Math.round(value * direction);
        }
    }, {
        key: 'randomColour',
        value: function randomColour() {
            var r = Math.abs(this.randomValue(255)),
                g = Math.abs(this.randomValue(255)),
                b = Math.abs(this.randomValue(255));

            return 'rgb(' + r + ',' + g + ',' + b + ')';
        }
    }]);

    return Strand;
})();

var Tama = (function () {
    function Tama(pubsub) {
        _classCallCheck(this, Tama);

        this.age = 0;
        this.lastFeed = 0;
        this.unhealthy = 0;
        this.size = 1;

        this.pubsub = pubsub;
        this.subscribe();

        this.strands = [new Strand()];
    }

    _createClass(Tama, [{
        key: 'subscribe',
        value: function subscribe() {
            this.pubsub.subscribe('action:feed', this.feed.bind(this));
        }
    }, {
        key: 'update',
        value: function update() {
            this.age += 1;

            if (this._unhealthy > 5) {
                this.die();
                return;
            }

            this.strands.forEach(function (strand) {
                strand.update();
            });
        }
    }, {
        key: 'draw',
        value: function draw(context) {
            for (var i = 0; i < this.strands.length; i += 1) {
                var strand = this.strands[i];

                context.beginPath();
                context.moveTo.apply(context, _toConsumableArray(strand.startingPoint()));
                context.bezierCurveTo.apply(context, _toConsumableArray(strand.bezierPoints()));
                context.strokeStyle = strand.colour;
                context.stroke();
            }
        }
    }, {
        key: 'fillColor',
        value: function fillColor() {
            return 'rgb(' + this.unhealthy * 10 + ', 50, 155)';
        }
    }, {
        key: 'feed',
        value: function feed() {
            var currentTime = Date.now();

            if (currentTime - this.lastFeed < 500) {
                this.unhealthy += 1;
            }

            this.size += 1;
            this.strands.push(new Strand());

            this.lastFeed = currentTime;
            this.write('I am fed.');

            console.log('unhealthy: ' + this.unhealthy);
        }
    }, {
        key: 'write',
        value: function write(string) {
            if (!string) {
                return;
            }

            this.pubsub.publish('text:add', string);
        }
    }, {
        key: 'die',
        value: function die() {
            this.write('I have died');
            this.pubsub.publish('action:die');
        }
    }]);

    return Tama;
})();

exports.default = Tama;

},{"./settings.js":4}],6:[function(require,module,exports){
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

},{}]},{},[2]);
