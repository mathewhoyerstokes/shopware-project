import Plugin from 'src/plugin-system/plugin.class';

export default class StickyBuyBarPlugin extends Plugin {
    init() {
        // Locate the main container buy button form on the default layout page
        this.mainBuyButtonForm = document.querySelector('.product-detail-buy .buy-widget');
        this.stickyBarElement = this.el;

        if (!this.mainBuyButtonForm || !this.stickyBarElement) return;

        this._initScrollObserver();
    }

    /**
     * Set up a highly optimized IntersectionObserver tracking window transitions
     */
    _initScrollObserver() {
        const options = {
            root: null, // relative to the viewport window bounding box
            threshold: 0, // trigger immediately when any element boundary changes
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If the primary buy section is out of frame view, slide up the floating helper component bar
                if (!entry.isIntersecting) {
                    this.stickyBarElement.classList.add('is-visible');
                } else {
                    this.stickyBarElement.classList.remove('is-visible');
                }
            });
        }, options);

        observer.observe(this.mainBuyButtonForm);
    }
}
