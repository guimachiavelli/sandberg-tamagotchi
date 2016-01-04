import settings from './settings.js';
import Mesh from './mesh.js';

class Tama {
    constructor(pubsub) {
        this.age = 0;
        this.lastFeed = 0;
        this.unhealthy = 0;
        this.size = 1;

        this.pubsub = pubsub;
        this.subscribe();

        this.mesh = new Mesh(1, 2);
    }

    subscribe() {
        this.pubsub.subscribe('action:feed', this.feed.bind(this));
    }

    update() {
        const currentTime = Date.now();

        this.age += 1;

        if (this._unhealthy > 5) {
            this.die();
            return;
        }

        if (currentTime - this.lastFeed > 10500) {
            // TODO
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

        this.mesh.updateQueue({width: this.mesh.strokeWidth + 3});
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
