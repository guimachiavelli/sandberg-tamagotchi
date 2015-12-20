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
