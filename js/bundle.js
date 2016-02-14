(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var Interface = function () {
    function Interface(pubsub) {
        _classCallCheck(this, Interface);

        this.interface = this.container();
        this.mercyButton = new Button('Be merciful', 'merciful');
        this.sweetButton = new Button('Sweeten all severities', 'sweeten');
        this.communeButton = new Button('Commune with the Unending', 'commune');
        this.punishButton = new Button('Punish the wicked', 'punish');
        this.kindnessButton = new Button('Be kind', 'kind');
        this.balanceButton = new Button('Seek balance in creation', 'balance');
        this.submissionButton = new Button('Submit to the obstacle', 'submission');
        this.patienceButton = new Button('Be patient', 'patience');
        this.penetrateButton = new Button('Penetrate the creation', 'penetrate');
        this.filterButton = new Button('Filter the cosmos', 'filter');
        this.addButtonToContainer(this.penetrateButton);
        this.addButtonToContainer(this.mercyButton);
        this.addButtonToContainer(this.sweetButton);
        this.addButtonToContainer(this.communeButton);
        this.addButtonToContainer(this.punishButton);
        this.addButtonToContainer(this.kindnessButton);
        this.addButtonToContainer(this.submissionButton);
        this.addButtonToContainer(this.patienceButton);
        this.addButtonToContainer(this.filterButton);
        this.addButtonToContainer(this.balanceButton);

        this.muteButton = new Button('Mute', 'mute');
        this.playButton = new Button('Play', 'play');
        this.addButtonToContainer(this.muteButton);
        this.addButtonToContainer(this.playButton);

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
            el.style.position = 'relative';
            el.style.zIndex = 1;

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
}();

exports.default = Interface;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interface = require('./interface.js');

var _interface2 = _interopRequireDefault(_interface);

var _tama = require('./tama.js');

var _tama2 = _interopRequireDefault(_tama);

var _textWindow = require('./textWindow.js');

var _textWindow2 = _interopRequireDefault(_textWindow);

var _pubsub = require('./pubsub.js');

var _pubsub2 = _interopRequireDefault(_pubsub);

var _song = require('./song.js');

var _song2 = _interopRequireDefault(_song);

var _settings = require('./settings.js');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
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

        this.song = new _song2.default(this.tama, this.pubsub);
    }

    _createClass(Game, [{
        key: 'setup',
        value: function setup() {
            this.interface.render();
            this.textWindow.render(document.body);
            this.pubsub.subscribe('action:die', this.end.bind(this));
            //this.song.setup();
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
            this.song.update();
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
            el.style.height = this.height / window.devicePixelRatio + 'px';
            el.style.position = 'absolute';
            el.style.top = 0;
            el.style.left = 0;
            el.style.zIndex = 0;

            document.body.appendChild(el);

            return el;
        }
    }, {
        key: 'draw',
        value: function draw() {
            //this.context.clearRect(0, 0, this.width, this.height);
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
}();

var game = new Game({
    width: _settings2.default.width,
    height: _settings2.default.height,
    pixelDensity: _settings2.default.pixelDensity
});

game.setup();
game.start();

},{"./interface.js":1,"./pubsub.js":4,"./settings.js":5,"./song.js":6,"./tama.js":8,"./textWindow.js":9}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _settings = require('./settings.js');

var _settings2 = _interopRequireDefault(_settings);

var _strand = require('./strand.js');

var _strand2 = _interopRequireDefault(_strand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mesh = function () {
    function Mesh() {
        var strokeWidth = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
        var strands = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        _classCallCheck(this, Mesh);

        this.queue = [];
        this.strokeWidth = strokeWidth;
        this.numberOfLines = strands || this.maxNumberOfStrands();
        this.spacing = this.calculatedSpacing();
        this.strands = this.lines();
    }

    _createClass(Mesh, [{
        key: 'maxNumberOfStrands',
        value: function maxNumberOfStrands() {
            return Math.floor(_settings2.default.width * _settings2.default.pixelDensity / this.strokeWidth);
        }
    }, {
        key: 'calculatedSpacing',
        value: function calculatedSpacing() {
            return Math.floor(_settings2.default.width * _settings2.default.pixelDensity - this.strokeWidth * this.numberOfLines) / this.numberOfLines;
        }
    }, {
        key: 'lines',
        value: function lines() {
            var amount = this.numberOfLines;
            var strands = [];
            var i = 0;

            while (i < amount) {
                var x = i * (this.strokeWidth + this.spacing) + this.strokeWidth;
                strands.push(new _strand2.default(this.strokeWidth, [x, 0], [x, 0], [x, 0], [x, _settings2.default.height * _settings2.default.pixelDensity]));
                i += 1;
            }

            return strands;
        }
    }, {
        key: 'draw',
        value: function draw(context) {
            this.strands.forEach(function (strand) {
                strand.draw(context);
            });
        }
    }, {
        key: 'update',
        value: function update() {
            this.processQueue();
        }
    }, {
        key: 'moveGroup',
        value: function moveGroup(command) {
            if (command.options.reverse === true) {
                command.actions[0] = command.actions[0] * -1;
                command.actions[1] = command.actions[1] * -1;
            }
            this.updateQueue(command);
        }
    }, {
        key: 'updateQueue',
        value: function updateQueue(action) {
            var increment = undefined;
            var steps = 1000 / 60;

            if (action.attribute === 'size') {
                increment = (action.actions - this.numberOfLines) / steps;
            } else {
                increment = this.strands.map(function (strand) {
                    var x = undefined,
                        y = undefined;

                    if (action.options.absolute === true) {
                        x = (action.actions[0] - strand.control1[0]) / steps;
                        y = (action.actions[1] - strand.control1[1]) / steps;
                    } else {
                        x = action.actions[0] / steps;
                        y = action.actions[1] / steps;
                    }

                    return [x, y];
                });
            }

            if (action.options.cancel === true) {
                this.queue = [];
            }

            for (var i = 0; i < steps; i += 1) {
                var queueAction = {
                    attribute: action.attribute,
                    increment: increment,
                    selector: action.options.selector
                };

                this.queue.push(queueAction);
            }
        }
    }, {
        key: 'processQueue',
        value: function processQueue() {
            if (this.queue.length < 1) {
                return;
            }

            var action = this.queue.shift();

            if (action.attribute === 'size') {
                this.updateMeshSize(action.increment);
                return;
            }

            this.updatePoint(action.attribute, action.increment, action.selector);
        }
    }, {
        key: 'updateWidth',
        value: function updateWidth(increment) {
            var spacing = this.spacing;

            this.strokeWidth += increment;

            var width = this.strokeWidth;

            this.strands.forEach(function (strand, i) {
                strand.width = width;
                strand.updateXCoordinates(i * (width + spacing) + width / 2);
            });
        }
    }, {
        key: 'updatePoint',
        value: function updatePoint(point, increments) {
            var selector = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

            increments.forEach(function (strandPoint, i) {
                var strand = this.strands[i];

                if (selector.indexOf(strand.colour) === -1) {
                    return;
                }
                strand[point][0] += strandPoint[0];
                strand[point][1] += strandPoint[1];
            }, this);
        }
    }, {
        key: 'updateMeshSize',
        value: function updateMeshSize(increment) {
            if (increment === 0) {
                return;
            }

            var lines = this.numberOfLines;

            lines += increment;
        }
    }]);

    return Mesh;
}();

exports.default = Mesh;

},{"./settings.js":5,"./strand.js":7}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PubSub = function () {
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
}();

exports.default = PubSub;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var settings = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelDensity: window.devicePixelRatio || 1,
    sephirot: {
        keter: {
            waveform: 'sine',
            colour: 'gold',
            frequency: 493.883,
            detune: 0,
            attack: 2000,
            release: 50,
            interval: 2000
        },
        chokhmah: {
            waveform: 'sine',
            colour: 'skyblue',
            frequency: 436,
            detune: 5,
            attack: 50,
            release: 20,
            interval: 500
        },
        binah: {
            waveform: 'sine',
            colour: 'crimson',
            frequency: 440,
            detune: 0,
            attack: 20,
            release: 50,
            interval: 500
        },
        chesed: {
            waveform: 'triangle',
            colour: 'darkviolet',
            frequency: 391.995,
            detune: 0,
            attack: 1,
            release: 1,
            interval: 5000
        },
        gevurah: {
            waveform: 'sine',
            colour: 'orange',
            frequency: 391.995,
            detune: 15,
            attack: 25,
            release: 1,
            interval: 5000
        },
        tiferet: {
            waveform: 'sine',
            colour: 'pink',
            frequency: 349.228,
            detune: 0,
            attack: 60,
            release: 60,
            interval: 5000
        },
        netzach: {
            waveform: 'sine',
            colour: 'olive',
            frequency: 329.628,
            detune: 0,
            attack: 25,
            release: 10,
            interval: 5000
        },
        hod: {
            waveform: 'sine',
            colour: 'purple',
            frequency: 329.628,
            detune: 50,
            attack: 70,
            release: 1,
            interval: 5000
        },
        yesod: {
            waveform: 'sine',
            colour: 'indigo',
            frequency: 293.665,
            detune: 0,
            attack: 1,
            release: 8,
            interval: 1500
        },
        malkuth: {
            waveform: 'triangle',
            colour: 'yellow',
            frequency: 110,
            detune: 0,
            attack: 10,
            release: 2000,
            interval: 1000
        }
    },
    colours: {
        keter: 'gold',
        chokhmah: 'skyblue',
        binah: 'crimson',
        chesed: 'darkviolet',
        gevurah: 'orange',
        tiferet: 'pink',
        netzach: 'olive',
        hod: 'purple',
        yesod: 'indigo',
        malkuth: 'yellow'
    },
    AudioContext: window.AudioContext || window.webkitAudioContext

};

Object.freeze(settings);

exports.default = settings;

},{}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _settings = require('./settings.js');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Song = function () {
    function Song(tama, pubsub) {
        _classCallCheck(this, Song);

        this.muted = false;
        this.defaultVolume = 0.1;
        this.lastUpdate = {};
        this.lastIncrement = Date.now();
        this.rhythm = 800;
        //this.defaultVolume = 0;

        this.context = new _settings2.default.AudioContext();
        this.tama = tama;
        this.strands = tama.mesh.strands;
        this.oscillators = this.oscillatorsFromSephirot();

        this.pubsub = pubsub;
        this.subscribe();
    }

    _createClass(Song, [{
        key: 'subscribe',
        value: function subscribe() {
            this.pubsub.subscribe('action:mute', this.mute.bind(this));
            this.pubsub.subscribe('action:play', this.startPlay.bind(this));
        }
    }, {
        key: 'mute',
        value: function mute() {
            this.muted = true;
        }
    }, {
        key: 'startPlay',
        value: function startPlay() {
            this.muted = false;
            this.play(0, 1, 1, 'sine');
        }
    }, {
        key: 'oscillatorsFromSephirot',
        value: function oscillatorsFromSephirot() {
            var sephirot = Object.keys(_settings2.default.sephirot);

            return sephirot.map(function (sephira) {
                var oscillator = {
                    name: sephira
                };

                this.lastUpdate[sephira] = Date.now();

                sephira = _settings2.default.sephirot[sephira];

                oscillator.waveform = sephira.waveform;
                oscillator.frequency = sephira.frequency;
                oscillator.detune = sephira.detune;
                oscillator.attack = sephira.attack;
                oscillator.release = sephira.release;
                oscillator.interval = sephira.interval;

                return oscillator;
            }, this);
        }
    }, {
        key: 'update',
        value: function update() {
            if (this.muted === true) {
                return;
            }

            var currentTime = Date.now(),
                aspect = this.tama.topSephira();

            this.oscillators.forEach(this.updateOscillator.bind(this, currentTime, aspect));
        }
    }, {
        key: 'updateOscillator',
        value: function updateOscillator(currentTime, aspect, oscillator) {
            var sephira = oscillator.name,
                sephiraScore = this.tama.sephirot[sephira];

            if (sephiraScore < 30) {
                return;
            }

            if (currentTime - this.lastUpdate[sephira] < oscillator.interval) {
                return;
            }

            this.incrementAttribute(aspect, sephiraScore, oscillator);

            this.play(oscillator.frequency, oscillator.attack, oscillator.release, oscillator.waveform, Math.random());

            this.lastUpdate[sephira] = currentTime;
        }
    }, {
        key: 'incrementAttribute',
        value: function incrementAttribute(aspect, score, oscillator) {
            var currentTime = Date.now();

            if (currentTime - this.lastIncrement < 300) {
                return;
            }

            this.lastIncrement = currentTime;

            if (Math.random() > 0.85) {
                oscillator.interval = _settings2.default.sephirot[oscillator.name].interval;
                oscillator.attack = _settings2.default.sephirot[oscillator.name].attack;
                oscillator.release = _settings2.default.sephirot[oscillator.name].release;
                oscillator.frequency = _settings2.default.sephirot[oscillator.name].frequency;
                return;
            }

            switch (aspect) {
                case 'keter':
                    oscillator.interval += score;
                    oscillator.attack += score;
                    oscillator.release += score;

                    if (oscillator.interval > 5000) {
                        oscillator.interval = 2000;
                    }
                    break;
                case 'malkuth':
                    oscillator.interval -= score;
                    oscillator.attack -= score;
                    oscillator.release -= score;

                    if (oscillator.interval < 100) {
                        oscillator.interval = 5000;
                    }

                    if (oscillator.attack < 10) {
                        oscillator.attack = 600;
                    }

                    if (oscillator.release < 5) {
                        oscillator.release = 100;
                    }

                    break;
                case 'chokmah':
                    oscillator.attack -= score;
                    break;
                case 'binah':
                    oscillator.attack += score;
                    break;
                case 'gevurah':
                    oscillator.frequency -= score / 20;
                    break;
                case 'chesed':
                    oscillator.frequency += score / 20;
                    break;

            }
        }
    }, {
        key: 'play',
        value: function play(freq, attack, release, waveform, volume) {
            var osc = this.context.createOscillator(),
                envelope = this.context.createGain(),
                contextTime = this.context.currentTime;

            volume = volume || this.defaultVolume;

            envelope.gain.setValueAtTime(volume, contextTime);
            envelope.connect(this.context.destination);
            envelope.gain.setValueAtTime(0, contextTime);
            envelope.gain.setTargetAtTime(volume, contextTime, attack / 1000);

            if (release > 0) {
                envelope.gain.setTargetAtTime(0, contextTime + attack / 1000, release / 1000);

                setTimeout(function () {
                    osc.stop();
                    osc.disconnect(envelope);
                    envelope.gain.cancelScheduledValues(contextTime);
                    envelope.disconnect(this.context.destination);
                }.bind(this), attack * 10 + release * 10);
            }

            osc.frequency.setValueAtTime(freq, contextTime);
            osc.type = waveform;
            osc.connect(envelope);
            osc.start();
        }
    }]);

    return Song;
}();

exports.default = Song;

},{"./settings.js":5}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _settings = require('./settings.js');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Strand = function () {
    function Strand(width, start, control1, control2, end) {
        _classCallCheck(this, Strand);

        this._width = width;
        this._start = start;
        this._control1 = control1;
        this._control2 = control2;
        this._end = end;
        this.colour = this._colour();
    }

    _createClass(Strand, [{
        key: '_colour',
        value: function _colour() {
            var colours = Object.keys(_settings2.default.colours);

            colours = colours.map(function (colour) {
                return _settings2.default.colours[colour];
            });

            return colours[Math.floor(Math.random() * colours.length)];
        }
    }, {
        key: 'draw',
        value: function draw(context) {
            context.beginPath();
            context.moveTo.apply(context, _toConsumableArray(this.start));
            context.bezierCurveTo.apply(context, _toConsumableArray(this.control1).concat(_toConsumableArray(this.control2), _toConsumableArray(this.end)));
            context.lineWidth = this.width;
            context.strokeStyle = this.colour;
            context.stroke();
            context.closePath();
        }
    }, {
        key: 'updateXCoordinates',
        value: function updateXCoordinates(newX) {
            this.start[0] = newX;
            this.control2[0] = newX;
            this.end[0] = newX;
        }
    }, {
        key: 'frequency',
        get: function get() {
            var min = 250;
            var max = 4500;
            var frequency = this._control1[0] + this._control2[0];

            frequency = Math.min(frequency, max);
            frequency = Math.max(frequency, min);

            return frequency;
        }
    }, {
        key: 'detune',
        get: function get() {
            return (this._control1[1] + this._control2[1]) * 10;
        }
    }, {
        key: 'width',
        set: function set(value) {
            this._width = value;
        },
        get: function get() {
            return this._width;
        }
    }, {
        key: 'start',
        set: function set(value) {
            if (value.length !== 2) {
                console.err('strand:start:set: invalid value');
            }

            this._start = value;
        },
        get: function get() {
            return this._start;
        }
    }, {
        key: 'control1',
        set: function set(value) {
            if (value.length !== 2) {
                console.err('strand:control1:set: invalid value');
            }

            this._control1 = value;
        },
        get: function get() {
            return this._control1;
        }
    }, {
        key: 'control2',
        set: function set(value) {
            if (value.length !== 2) {
                console.err('strand:control2:set: invalid value');
            }

            this._control2 = value;
        },
        get: function get() {
            return this._control2;
        }
    }, {
        key: 'end',
        set: function set(value) {
            if (value.length !== 2) {
                console.err('strand:end:set: invalid value');
            }

            this._end = value;
        },
        get: function get() {
            return this._end;
        }
    }]);

    return Strand;
}();

exports.default = Strand;

},{"./settings.js":5}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _settings = require('./settings.js');

var _settings2 = _interopRequireDefault(_settings);

var _mesh = require('./mesh.js');

var _mesh2 = _interopRequireDefault(_mesh);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tama = function () {
    function Tama(pubsub) {
        _classCallCheck(this, Tama);

        this.latestAction = Date.now();
        this.age = 0;
        this.lastFeed = 0;
        this.unhealthy = 0;
        this.size = 5;

        this.pubsub = pubsub;
        this.subscribe();

        this.mesh = new _mesh2.default(1);

        this.sephirot = {
            keter: this.randomStartValue(),
            chokhmah: this.randomStartValue(),
            binah: this.randomStartValue(),
            chesed: this.randomStartValue(),
            gevurah: this.randomStartValue(),
            tiferet: this.randomStartValue(),
            netzach: this.randomStartValue(),
            hod: this.randomStartValue(),
            yesod: this.randomStartValue(),
            malkuth: this.randomStartValue()
        };
    }

    _createClass(Tama, [{
        key: 'randomStartValue',
        value: function randomStartValue() {
            return Math.floor(Math.random() * 50) + 10;
        }
    }, {
        key: 'topSephira',
        value: function topSephira() {
            var top = {
                name: null,
                value: 0
            };

            for (var sephira in this.sephirot) {
                if (this.sephirot.hasOwnProperty(sephira) !== true) {
                    continue;
                }

                if (this.sephirot[sephira] <= top.value) {
                    continue;
                }

                top.name = sephira;
                top.value = this.sephirot[sephira];
            }

            return top.name;
        }
    }, {
        key: 'subscribe',
        value: function subscribe() {
            this.pubsub.subscribe('action:penetrate', this.penetrate.bind(this));
            this.pubsub.subscribe('action:merciful', this.merciful.bind(this));
            this.pubsub.subscribe('action:sweeten', this.sweeten.bind(this));
            this.pubsub.subscribe('action:commune', this.commune.bind(this));
            this.pubsub.subscribe('action:punish', this.punish.bind(this));
            this.pubsub.subscribe('action:kind', this.kind.bind(this));
            this.pubsub.subscribe('action:balance', this.balance.bind(this));
            this.pubsub.subscribe('action:submission', this.submission.bind(this));
            this.pubsub.subscribe('action:patience', this.patience.bind(this));
            this.pubsub.subscribe('action:filter', this.filter.bind(this));
        }
    }, {
        key: 'randomSephirot',
        value: function randomSephirot() {
            var sephirotNames = Object.keys(this.sephirot);
            return sephirotNames[Math.floor(Math.random() * sephirotNames.length)];
        }
    }, {
        key: 'update',
        value: function update() {
            var currentTime = Date.now();

            this.age += 1;

            if (this._unhealthy > 5) {
                this.die();
                return;
            }

            if (currentTime - this.latestAction > 2000) {
                this.idle(this.randomSephirot());
            }

            this.mesh.update();
        }
    }, {
        key: 'draw',
        value: function draw(context) {
            this.mesh.draw(context);
        }
    }, {
        key: 'merciful',
        value: function merciful() {
            //keter
            var revert = Math.random() > 0.5;

            this.sephirot.keter += 10;
            this.sephirot.malkuth -= 5;

            this.mesh.moveGroup({
                attribute: 'control1',
                actions: [-200, 160],
                options: {
                    cancel: true,
                    selector: [_settings2.default.sephirot.keter.colour]
                }
            });

            this.mesh.moveGroup({
                attribute: 'control2',
                actions: [50, -300],
                options: {
                    selector: [_settings2.default.sephirot.keter.colour],
                    reverse: revert
                }
            });

            this.latestAction = Date.now();
        }
    }, {
        key: 'sweeten',
        value: function sweeten() {
            //Binah
            var revert = Math.random() > 0.5;

            this.sephirot.binah += 10;
            this.sephirot.chokhmah -= 10;

            this.mesh.moveGroup({
                attribute: 'control2',
                actions: [500, 160],
                options: {
                    selector: [_settings2.default.sephirot.binah.colour],
                    reverse: revert
                }
            });

            this.mesh.moveGroup({
                attribute: 'end',
                actions: [-500, -60],
                options: {
                    selector: [_settings2.default.sephirot.binah.colour],
                    reverse: revert
                }
            });

            this.latestAction = Date.now();
        }
    }, {
        key: 'commune',
        value: function commune() {
            //Chokmah
            var revert = Math.random() > 0.5;

            this.sephirot.chokhmah += 10;
            this.sephirot.binah -= 10;

            this.mesh.moveGroup({
                attribute: 'control2',
                actions: [200, 160],
                options: {
                    selector: [_settings2.default.sephirot.chokhmah.colour],
                    reverse: revert
                }
            });

            this.mesh.moveGroup({
                attribute: 'control2',
                actions: [200, -1600],
                options: {
                    selector: [_settings2.default.sephirot.chokhmah.colour],
                    reverse: revert
                }
            });

            this.latestAction = Date.now();
        }
    }, {
        key: 'punish',
        value: function punish() {
            var revert = Math.random() > 0.5;

            this.sephirot.gevurah += 10;
            this.sephirot.chesed -= 10;

            this.mesh.moveGroup({
                attribute: 'control2',
                actions: [200, 160],
                options: {
                    selector: [_settings2.default.sephirot.gevurah.colour],
                    reverse: revert
                }
            });

            this.mesh.moveGroup({
                attribute: 'start',
                actions: [600, 1.6],
                options: {
                    selector: [_settings2.default.sephirot.gevurah.colour],
                    reverse: revert
                }
            });

            this.latestAction = Date.now();
        }
    }, {
        key: 'kind',
        value: function kind() {
            var revert = Math.random() > 0.5;

            this.sephirot.chesed += 10;
            this.sephirot.gevurah -= 10;

            this.mesh.moveGroup({
                attribute: 'control2',
                actions: [200, 160],
                options: {
                    selector: [_settings2.default.sephirot.chesed.colour],
                    reverse: revert
                }
            });

            this.mesh.moveGroup({
                attribute: 'control1',
                actions: [-200, 260],
                options: {
                    selector: [_settings2.default.sephirot.chesed.colour],
                    reverse: revert
                }
            });

            this.latestAction = Date.now();
        }
    }, {
        key: 'balance',
        value: function balance() {
            var revert = Math.random() > 0.5;

            this.sephirot.tiferet += 10;
            this.sephirot.gevurah -= 5;
            this.sephirot.chesed -= 5;
            this.sephirot.hod -= 5;
            this.sephirot.netzach -= 5;

            this.mesh.moveGroup({
                attribute: 'control1',
                actions: [10, 160],
                options: {
                    selector: [_settings2.default.sephirot.tiferet.colour],
                    reverse: revert
                }
            });

            this.mesh.moveGroup({
                attribute: 'control1',
                actions: [10, 160],
                options: {
                    selector: [_settings2.default.sephirot.tiferet.colour]
                }
            });

            this.mesh.moveGroup({
                attribute: 'control2',
                actions: [16, 16],
                options: {
                    selector: [_settings2.default.sephirot.tiferet.colour]
                }
            });

            this.latestAction = Date.now();
        }
    }, {
        key: 'submission',
        value: function submission() {
            var revert = Math.random() > 0.5;

            this.sephirot.hod += 10;
            this.sephirot.netzach -= 10;

            this.mesh.moveGroup({
                attribute: 'end',
                actions: [10, 160],
                options: {
                    selector: [_settings2.default.sephirot.hod.colour],
                    reverse: revert
                }
            });

            this.mesh.moveGroup({
                attribute: 'end',
                actions: [Math.random() * 160, Math.random() * 260],
                options: {
                    selector: [_settings2.default.sephirot.hod.colour],
                    reverse: revert
                }
            });

            this.latestAction = Date.now();
        }
    }, {
        key: 'patience',
        value: function patience() {
            var revert = Math.random() > 0.5;

            this.sephirot.netzach += 10;
            this.sephirot.hod -= 10;

            this.mesh.moveGroup({
                attribute: 'start',
                actions: [410, 10],
                options: {
                    selector: [_settings2.default.sephirot.netzach.colour],
                    reverse: revert
                }
            });

            this.mesh.moveGroup({
                attribute: 'control2',
                actions: [100, -10],
                options: {
                    selector: [_settings2.default.sephirot.netzach.colour]
                }
            });

            this.latestAction = Date.now();
        }
    }, {
        key: 'penetrate',
        value: function penetrate() {
            var revert = Math.random() > 0.5;

            this.sephirot.yesod += 10;
            this.sephirot.hod -= 10;
            this.sephirot.netzach -= 10;
            this.sephirot.malkuth -= 10;

            this.mesh.moveGroup({
                attribute: 'control2',
                actions: [150, 1300],
                options: {
                    selector: [_settings2.default.sephirot.yesod.colour],
                    cancel: true,
                    reverse: revert
                }
            });

            this.latestAction = Date.now();
        }
    }, {
        key: 'filter',
        value: function filter() {
            this.sephirot.malkuth += 10;

            this.mesh.moveGroup({
                attribute: 'control2',
                actions: [150, 300],
                options: {
                    selector: [_settings2.default.sephirot.malkuth.colour],
                    cancel: true
                }
            });

            this.latestAction = Date.now();
        }
    }, {
        key: 'idle',
        value: function idle(sephirot) {
            var positive = Math.random() > 0.5,
                attr = Math.random() > 0.5 ? 'control1' : 'control2',
                action = positive === true ? 32 : -32,
                sephira = this.randomSephirot();

            this.sephirot[sephira] += Math.random() > 0.5 ? 10 : -10;

            this.mesh.moveGroup({
                attribute: attr,
                actions: [action, action],
                options: {
                    selector: [_settings2.default.colours[sephirot]]
                }
            });

            this.latestAction = Date.now();
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
}();

exports.default = Tama;

},{"./mesh.js":3,"./settings.js":5}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextWindow = function () {
    function TextWindow(pubsub) {
        _classCallCheck(this, TextWindow);

        this._el = document.createElement('div');
        this._el.className = 'text-window';
        this._el.style.position = 'relative';
        this._el.style.zIndex = 10;
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
}();

exports.default = TextWindow;

},{}]},{},[2]);
