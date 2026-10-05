import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class ProductFinderQuizPlugin extends Plugin {
    init() {
        this.currentStep = 1;
        this.totalSteps = 2;
        this.listingBaseUrl = this.el.getAttribute('data-listing-url');

        // Locate internal component control selectors securely
        this.btnNext = DomAccess.querySelector(this.el, '[data-finder-next]');
        this.btnBack = DomAccess.querySelector(this.el, '[data-finder-back]');
        this.indicator = DomAccess.querySelector(this.el, '[data-finder-step-indicator]');

        this._registerEvents();
    }

    _registerEvents() {
        // Unlock navigation paths once a selection is actively confirmed
        this.el.addEventListener('change', () => {
            this.btnNext.removeAttribute('disabled');
        });

        this.btnNext.addEventListener('click', () => this._handleNextStep());
        this.btnBack.addEventListener('click', () => this._handlePreviousStep());
    }

    _handleNextStep() {
        if (this.currentStep < this.totalSteps) {
            // Transition view matrix visibility panels
            DomAccess.querySelector(this.el, `[data-finder-step="${this.currentStep}"]`).classList.add('is-hidden');
            this.currentStep++;
            DomAccess.querySelector(this.el, `[data-finder-step="${this.currentStep}"]`).classList.remove('is-hidden');

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

            if (this.currentStep === 1) this.btnBack.classList.add('is-hidden');
            this.btnNext.removeAttribute('disabled');
            this.btnNext.innerText = 'Continue';
            this.indicator.innerText = `Step ${this.currentStep} of ${this.totalSteps}`;
        }
    }

    /**
     * Build standard e-commerce filter arrays and synchronize results against native listings
     */
    _compileAndExecuteFilterQuery() {
        const selectedRadioElements = this.el.querySelectorAll('input[type="radio"]:checked');
        const propertyIds = [];

        selectedRadioElements.forEach(radio => {
            propertyIds.push(radio.value);
        });

        // Construct standard Shopware URL filtering strings matching default request models
        // Properties are passed as query parameters (e.g. ?properties=id1,id2)
        const filterQueryString = `?properties=${propertyIds.join('|')}`;
        const routingTarget = `${this.listingBaseUrl}${filterQueryString}`;

        this.btnNext.innerText = 'Searching...';
        this.btnNext.setAttribute('disabled', 'true');

        // Execute hard cross-origin viewport redirect window updates mapping to the filtered catalog view
        window.location.href = routingTarget;
    }
}
