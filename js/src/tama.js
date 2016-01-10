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
        this.pubsub.subscribe('action:feed', this.feed.bind(this));
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

    feed() {
        const currentTime = Date.now();

        if (currentTime - this.lastFeed < 500) {
            this.unhealthy += 1;
        }

        this.size += 1;

        this.lastFeed = currentTime;
        this.write('I am fed.');

        this.mesh.updateQueue({attribute: 'size',
                               actions: this.size });

        this.latestAction = currentTime;
    }

    idle(sephirot) {
        const positive = Math.random() > 0.5,
              attr = Math.random() > 0.5 ? 'control1' : 'control2',
              action = positive === true ? 16 : -16;

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
