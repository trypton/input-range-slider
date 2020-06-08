import template from './input-slider-template';

const SLIDER_STATE = {
  NOT_SLIDING: 'NOT_SLIDING',
  SLIDING_FROM: 'SLIDING_FROM',
  SLIDING_TO: 'SLIDING_TO',
};

export class InputSlider extends HTMLElement {
  get value() {
    if (!this.hasAttribute('value')) {
      return [];
    }

    const value = this.getAttribute('value');

    try {
      const arr = JSON.parse(value);

      if (Array.isArray(arr)) {
        const from = typeof arr[0] !== 'undefined' ? Number(arr[0]) : Number.NaN;
        if (Number.isNaN(from) || !Number.isSafeInteger(from)) {
          return [];
        }

        const to = typeof arr[1] !== 'undefined' ? Number(arr[1]) : Number.NaN;
        if (Number.isNaN(to) || !Number.isSafeInteger(to)) {
          return [from];
        }

        return [from, to];
      }
    } catch {
      return [];
    }

    const number = value.length ? Number(value) : Number.NaN;
    if (!Number.isNaN(number) && Number.isSafeInteger(number)) {
      return [number];
    }

    return [];
  }

  set value(value) {
    if (!Array.isArray(value) || typeof value[0] === 'undefined') {
      this.setAttribute('value', '');
    }

    if (typeof value[1] === 'undefined') {
      this.setAttribute('value', value[0]);
    } else {
      this.setAttribute('value', JSON.stringify(value));
    }
  }

  get from() {
    return typeof this.value[0] === 'undefined' ? (this.max - this.min) / 2 : this.value[0];
  }

  set from(from) {
    this.value = typeof this.value[1] === 'undefined' ? [from] : [from, this.value[1]];
  }

  get to() {
    return typeof this.value[1] === 'undefined' ? null : this.value[1];
  }

  set to(to) {
    this.value = [this.from, to];
  }

  get min() {
    return this._getNumericAttribute('min', 0);
  }

  get max() {
    return this._getNumericAttribute('max', 100);
  }

  get step() {
    return this._getNumericAttribute('step', 1);
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.sliderState = SLIDER_STATE.NOT_SLIDING;

    // Initialize
    this.performUpdate();

    const root = this.shadowRoot.querySelector('div');
    root.addEventListener('input', this.handleInput.bind(this));
    root.addEventListener('pointerup', this.resetSliderState.bind(this));
    root.addEventListener('keyup', this.resetSliderState.bind(this));

    // Fire change event on custom element
    root.addEventListener('change', this.handleChange.bind(this));
  }

  handleInput(ev) {
    const { target } = ev;
    const { name } = target;

    const from = this.from;
    const to = this.to === null ? Number.POSITIVE_INFINITY : this.to;

    const newValue = Number(target.value);

    if (
      (name === 'from' && this.sliderState !== SLIDER_STATE.SLIDING_TO) ||
      this.sliderState === SLIDER_STATE.SLIDING_FROM
    ) {
      // All clicks on the track will always be handled by `from` input
      if (this.sliderState === SLIDER_STATE.NOT_SLIDING) {
        // Click on the second half of the range
        // ------o=======x==o------
        const isSetToInsideRange = newValue > Math.round((to - from) / 2) + from;

        // Click on the right outside range
        // ------o===========o--x---
        const isSetToOutsideRange = newValue > to;

        if (isSetToInsideRange || isSetToOutsideRange) {
          this.to = newValue;
          this.performUpdate();
          return;
        }
      }

      if (newValue > to) {
        // Force direction change if newValue > prevValue + 1
        this.value = [to, newValue];
      } else {
        this.from = newValue;
      }

      // Change slider direction when newValue === to
      this.sliderState = newValue < to ? SLIDER_STATE.SLIDING_FROM : SLIDER_STATE.SLIDING_TO;
    } else {
      if (newValue < from) {
        // Force direction change if newValue > prevValue + 1
        this.value = [newValue, from];
      } else {
        this.to = newValue;
      }

      // Change slider direction when newValue === from
      this.sliderState = newValue > from ? SLIDER_STATE.SLIDING_TO : SLIDER_STATE.SLIDING_FROM;
    }

    this.performUpdate();
  }

  handleChange() {
    this.dispatchEvent(new Event('change'));
  }

  resetSliderState() {
    this.sliderState = SLIDER_STATE.NOT_SLIDING;
    this.performUpdate();
  }

  performInputUpdate(name, value, hidden = false) {
    const input = this.shadowRoot.querySelector(`input[name="${name}"]`);
    input.setAttribute('min', this.min);
    input.setAttribute('max', this.max);
    input.setAttribute('step', this.step);

    input.value = value;
    input.setAttribute('value', value);

    if (hidden) {
      input.setAttribute('hidden', '');
    } else {
      input.removeAttribute('hidden');
    }
  }

  performUpdate() {
    const { from, to, min, max } = this;
    const isRange = to !== null;

    const root = this.shadowRoot.querySelector('div');
    root.style.setProperty('--from', isRange ? from : min);
    root.style.setProperty('--to', isRange ? to : from);
    root.style.setProperty('--min', min);
    root.style.setProperty('--max', max);

    root.classList[this.sliderState !== SLIDER_STATE.NOT_SLIDING ? 'add' : 'remove']('input-slider--sliding');

    this.performInputUpdate('from', from);
    this.performInputUpdate('to', to, !isRange);
  }

  _getNumericAttribute(name, defaultValue = 0) {
    if (!this.hasAttribute(name)) {
      return defaultValue;
    }

    const value = Number(this.getAttribute(name));

    if (Number.isNaN(value) || !Number.isSafeInteger(value)) {
      return defaultValue;
    }

    return value;
  }
}

customElements.define('input-slider', InputSlider);
