import Plugin from 'src/plugin-system/plugin.class';

export default class StickyBuyBarPlugin extends Plugin {
    init() {
        this.el.classList.add('is-visible');
    }
}
