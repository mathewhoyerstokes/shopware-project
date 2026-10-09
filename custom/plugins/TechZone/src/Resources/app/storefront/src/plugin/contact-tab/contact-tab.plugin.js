import Plugin from 'src/plugin-system/plugin.class';

export default class ContactTabPlugin extends Plugin {
    init() {
        this.openButton = this.el.querySelector('[data-contact-tab-open]');
        this.closeButton = this.el.querySelector('[data-contact-tab-close]');
        this.panel = this.el.querySelector('.contact-tab__panel');

        this._registerEvents();
    }

    _registerEvents() {
        this.openButton.addEventListener('click', this._onOpenClick.bind(this));
        this.closeButton.addEventListener('click', this._onCloseClick.bind(this));
        document.addEventListener('keydown', this._onKeydown.bind(this));
    }

    _onOpenClick() {
        this._setOpen(!this.el.classList.contains('is-open'));
    }

    _onCloseClick() {
        this._setOpen(false);
        this.openButton.focus();
    }

    _onKeydown(event) {
        if (event.key === 'Escape') {
            this._setOpen(false);
        }
    }

    _setOpen(open) {
        this.el.classList.toggle('is-open', open);
        this.openButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        this.panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
}
