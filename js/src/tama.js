import settings from './settings.js';
import Mesh from './mesh.js';

class Tama {
    constructor(pubsub) {
        this.latestAction = Date.now();
        this.age = 0;
        this.lastFeed = 0;
        this.unhealthy = 0;
        this.size = 5;

        this.pubsub = pubsub;
        this.subscribe();

        this.mesh = new Mesh(1, this.size);
        this.mesh = new Mesh(1);

        this.sephirot = {
            keter: 0,
            chokhmah: 0,
            binah: 0,
            chesed: 0,
            gevurah: 0,
            tiferet: 0,
            netzach: 0,
            hod: 0,
            yesod: 0,
            malkuth: 0
        };
    }

    subscribe() {
        this.pubsub.subscribe('action:play-love', this.play.bind(this));
        this.pubsub.subscribe('action:travel-time', this.timetravel.bind(this));
        this.pubsub.subscribe('action:frenzy', this.frenzy.bind(this));
    }

    randomSephirot() {
        const sephirotNames = Object.keys(this.sephirot);
        return sephirotNames[Math.floor(Math.random() * sephirotNames.length)];
    }

    update() {
        const currentTime = Date.now();

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

    draw(context) {
        this.mesh.draw(context);
    }

    play() {
        //this.write('The LORD your God is in your midst, a mighty one who will save;');

        this.sephirot.tiferet += 1;
        this.sephirot.malkuth -= 1;

        this.mesh.moveGroup({
            attribute: 'control1',
            actions: [150, -300],
            options: {
                selector: [settings.sephirot.tiferet.colour,
                           settings.sephirot.malkuth.colour],
                cancel: true
            }
        });
    }

    frenzy() {
        const sephira = this.randomSephirot(),
              attribute = Math.random() > 0.5 ? 'control2' : 'control1',
              x = Math.random() > 0.5 ? 500 : -500,
              y = Math.random() > 0.5 ? 500 : -500;

         this.mesh.moveGroup({
            attribute: attribute,
            actions: [x, y],
            options: {
                selector: [settings.sephirot[sephira].colour],
                cancel: true
            }
        });
    }

    timetravel() {
        //this.write('You are in Da\'at');
        this.sephirot.keter += 10;

        this.mesh.moveGroup({
            attribute: 'control2',
            actions: [-250, 600],
            options: {
                selector: [settings.sephirot.tiferet.colour,
                           settings.sephirot.malkuth.colour],
                cancel: true
            }
        });
    }

    idle(sephirot) {
        const positive = Math.random() > 0.5,
              attr = Math.random() > 0.5 ? 'control1' : 'control2',
              action = positive === true ? 16 : -16,
              sephira = this.randomSephirot();

        this.sephirot[sephira] += Math.random() > 0.5 ? 0.005 : -0.001;

        if (this.sephirot[sephira] > 5) {
            this.sephirot[sephira] = 0;
        }

        if (Math.random() > 0.85) {
            this.sephirot[sephira] = 0;
        }

        this.mesh.moveGroup({
            attribute: attr,
            actions: [action, action],
            options: {
                selector: [settings.colours[sephirot]],
                cancel: true
            }
        });

        this.latestAction = Date.now();
    }

    write(string) {
        if (!string) {
            return;
        }

        this.pubsub.publish('text:add', string);
    }

    die() {
        this.write('I have died');
        this.pubsub.publish('action:die');
    }
}

export default Tama;
