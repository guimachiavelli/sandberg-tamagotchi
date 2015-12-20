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
