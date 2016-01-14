class Button {
    constructor(name, action) {
        this.el = document.createElement('button');
        this.el.innerHTML = name;
        this.el.type = 'button';
        this.el.dataset.action = action;
    }
}

class Interface {
    constructor(pubsub) {
        this.interface = this.container();
        this.playButton = new Button('Play with love', 'play-love');
        this.travelButton = new Button('Travel in time', 'travel-time');
        this.crazyButton = new Button('Go in a crazy spiritual frenzy', 'frenzy');
        this.muteButton = new Button('Mute', 'mute');

        this.addButtonToContainer(this.playButton);
        this.addButtonToContainer(this.travelButton);
        this.addButtonToContainer(this.crazyButton);
        this.addButtonToContainer(this.muteButton);

        this.pubsub = pubsub;

        this.bind();
    }

    bind() {
        this.interface.addEventListener('click', this.onClick.bind(this));
    }

    container() {
        const el = document.createElement('div');
        el.className = 'interface';
        el.style.position = 'relative';
        el.style.zIndex = 1;

        return el;
    }

    addButtonToContainer(button) {
        this.interface.appendChild(button.el);
    }

    render() {
        document.body.appendChild(this.interface);
    }

    onClick(e) {
        const target = e.target;

        if (target.nodeName !== 'BUTTON') {
            return;
        }

        this.pubsub.publish('action:' + target.dataset.action);
    }
}

export default Interface;
