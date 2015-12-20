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
        this.feedButton = new Button('Feed', 'feed');
        this.addButtonToContainer(this.feedButton);

        this.pubsub = pubsub;

        this.bind();
    }

    bind() {
        this.interface.addEventListener('click', this.onClick.bind(this));
    }

    container() {
        const el = document.createElement('div');
        el.className = 'interface';

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
