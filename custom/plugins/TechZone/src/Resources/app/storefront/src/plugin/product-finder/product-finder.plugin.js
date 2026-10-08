import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class ProductFinderQuizPlugin extends Plugin {
    init() {
        this.currentStep = 1;
        this.totalSteps = 2;
        this.listingBaseUrl = this.el.getAttribute('data-listing-url');

        this.btnNext = DomAccess.querySelector(this.el, '[data-finder-next]');
        this.btnBack = DomAccess.querySelector(this.el, '[data-finder-back]');
        this.indicator = DomAccess.querySelector(this.el, '[data-finder-step-indicator]');

        this._registerEvents();
    }

    _registerEvents() {
        this.el.addEventListener('change', () => {
            this.btnNext.removeAttribute('disabled');
        });

        this.btnNext.addEventListener('click', () => this._handleNextStep());
        this.btnBack.addEventListener('click', () => this._handlePreviousStep());
    }

    _handleNextStep() {
        if (this.currentStep < this.totalSteps) {
            DomAccess.querySelector(this.el, `[data-finder-step="${this.currentStep}"]`).classList.add('is-hidden');
            this.currentStep++;
            DomAccess.querySelector(this.el, `[data-finder-step="${this.currentStep}"]`).classList.remove('is-hidden');
            this._showSelectedGroup();

            this.btnBack.classList.remove('is-hidden');
            this.btnNext.setAttribute('disabled', 'true');
            this.btnNext.innerText = this.currentStep === this.totalSteps ? 'Show Matches' : 'Continue';
            this.indicator.innerText = `Step ${this.currentStep} of ${this.totalSteps}`;
        } else {
            this._compileAndExecuteFilterQuery();
        }
    }

    _handlePreviousStep() {
        if (this.currentStep > 1) {
            DomAccess.querySelector(this.el, `[data-finder-step="${this.currentStep}"]`).classList.add('is-hidden');
            this.currentStep--;
            DomAccess.querySelector(this.el, `[data-finder-step="${this.currentStep}"]`).classList.remove('is-hidden');

            if (this.currentStep === 1) {
                this.btnBack.classList.add('is-hidden');
            }

            this.btnNext.removeAttribute('disabled');
            this.btnNext.innerText = 'Continue';
            this.indicator.innerText = `Step ${this.currentStep} of ${this.totalSteps}`;
        }
    }

    _showSelectedGroup() {
        const focus = this.el.querySelector('input[name="focus"]:checked');
        const groupId = focus ? focus.value : '';
        const question = this.el.querySelector('[data-finder-question]');

        if (question && focus) {
            const label = focus.getAttribute('data-finder-question');

            if (label) {
                question.textContent = label;
            }
        }

        this.el.querySelectorAll('[data-finder-group]').forEach((group) => {
            const matches = group.getAttribute('data-finder-group') === groupId;
            group.classList.toggle('is-hidden', !matches);

            if (matches) {
                group.querySelectorAll('input').forEach((input) => {
                    input.checked = false;
                });
            }
        });
    }

    _compileAndExecuteFilterQuery() {
        const selected = this.el.querySelector('[data-finder-group]:not(.is-hidden) input[name="property"]:checked');

        if (!selected || !selected.value) {
            return;
        }

        let target = this.listingBaseUrl;
        target += `${target.indexOf('?') === -1 ? '?' : '&'}properties=${selected.value}`;

        this.btnNext.innerText = 'Searching...';
        this.btnNext.setAttribute('disabled', 'true');

        window.location.href = target;
    }
}
