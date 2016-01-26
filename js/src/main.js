import Interface from './interface.js';
import Tama from './tama.js';
import TextWindow from './textWindow.js';
import PubSub from './pubsub.js';
import Song from './song.js';
import settings from './settings.js';

class Game {
    constructor(options = {width: 500, height: 500}) {
        this.pixelDensity = options.pixelDensity || 1;
        this.width = options.width * this.pixelDensity;
        this.height = options.height * this.pixelDensity;

        this.stage = this.canvas();
        this.context = this.stage.getContext('2d');
        this.running = false;

        this.pubsub = new PubSub();
        this.tama = new Tama(this.pubsub);
        this.interface = new Interface(this.pubsub);
        this.textWindow = new TextWindow(this.pubsub);

        this.song = new Song(this.tama, this.pubsub);
    }

    setup() {
        this.interface.render();
        this.textWindow.render(document.body);
        this.pubsub.subscribe('action:die', this.end.bind(this));
        //this.song.setup();
    }

    start() {
        this.running = true;
        this.update();
    }

    update() {
        if (this.running === false) {
            return;
        }
        this.tama.update();

        this.draw();
        this.song.update();
        window.requestAnimationFrame(this.update.bind(this));
    }

    canvas() {
        const el = document.createElement('canvas');
        el.className = 'stage';
        el.width = this.width;
        el.height = this.height;

        el.style.width = `${this.width/window.devicePixelRatio}px`;
        el.style.height = `${this.height/window.devicePixelRatio}px`;
        el.style.position = 'absolute';
        el.style.top = 0;
        el.style.left = 0;
        el.style.zIndex = 0;

        document.body.appendChild(el);

        return el;
    }

    draw() {
        //this.context.clearRect(0, 0, this.width, this.height);
        this.tama.draw(this.context);
    }

    end() {
        this.running = false;
    }

    log(args) {
        console.log('log', args);
    }
}

const game = new Game({
    width: settings.width,
    height: settings.height,
    pixelDensity: settings.pixelDensity
});

game.setup();
game.start();
