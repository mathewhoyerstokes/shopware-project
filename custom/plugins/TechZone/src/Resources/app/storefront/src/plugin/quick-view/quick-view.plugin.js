import Plugin from 'src/plugin-system/plugin.class';

export default class QuickViewPlugin extends Plugin {
    init() {
        this._registerEvents();
    }

    _registerEvents() {
        this.el.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-quick-view-trigger]');
            if (!trigger) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const productUrl = trigger.getAttribute('data-product-url');
            if (productUrl) {
                this._openQuickViewModal(productUrl);
            }
        });
    }

    _openQuickViewModal(url) {
        this._createModalSkeleton();

        // Shopware rejects full pages requested with X-Requested-With: XMLHttpRequest.
        fetch(url, {
            credentials: 'same-origin',
            headers: {
                Accept: 'text/html',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Product request failed');
                }

                return response.text();
            })
            .then((html) => this._renderModalContent(html))
            .catch(() => this._renderModalContent(''));
    }

    _createModalSkeleton() {
        this._closeModal();

        const overlay = document.createElement('div');
        overlay.id = 'quickview-overlay';
        overlay.className = 'quick-view-overlay';
        overlay.innerHTML = '<div class="quick-view-dialog"><div class="quick-view-loading"></div></div>';
        document.body.appendChild(overlay);

        this._escapeListener = (event) => {
            if (event.key === 'Escape') {
                this._closeModal();
            }
        };
        window.addEventListener('keydown', this._escapeListener);
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                this._closeModal();
            }
        });
    }

    _renderModalContent(htmlPayload) {
        const overlay = document.getElementById('quickview-overlay');
        if (!overlay) {
            return;
        }

        const parsed = new DOMParser().parseFromString(htmlPayload, 'text/html');
        const detail = parsed.querySelector('.product-detail');

        const dialog = document.createElement('div');
        dialog.className = 'quick-view-dialog';

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'quick-view-close';
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.textContent = '\u00d7';
        closeButton.addEventListener('click', () => this._closeModal());

        const content = document.createElement('div');
        content.className = 'quick-view-content';
        content.innerHTML = detail ? detail.innerHTML : '<p>This product could not be loaded.</p>';

        dialog.appendChild(closeButton);
        dialog.appendChild(content);
        overlay.innerHTML = '';
        overlay.appendChild(dialog);

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                this._closeModal();
            }
        });

        if (detail) {
            window.PluginManager.initializePlugins();
        }
    }

    _closeModal() {
        const overlay = document.getElementById('quickview-overlay');
        if (overlay) {
            overlay.remove();
        }

        if (this._escapeListener) {
            window.removeEventListener('keydown', this._escapeListener);
            this._escapeListener = null;
        }
    }
}
