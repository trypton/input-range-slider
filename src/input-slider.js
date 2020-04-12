import { LitElement, html } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { live } from 'lit-html/directives/live';
import { inputSliderStyles } from './input-slider-styles';

const SLIDER_STATE = {
  NOT_SLIDING: 'NOT_SLIDING',
  SLIDING_FROM: 'SLIDING_FROM',
  SLIDING_TO: 'SLIDING_TO',
};

export class InputSlider extends LitElement {
  static get properties() {
    return {
      value: {
        type: Array,
        reflect: true,
        converter: {
          fromAttribute: (value) => {
            try {
              const arr = JSON.parse(value);

              if (Array.isArray(arr)) {
                const from = typeof arr[0] !== 'undefined' ? Number(arr[0]) : Number.NaN;
                if (Number.isNaN(from) || !Number.isFinite(from)) {
                  return [];
                }

                const to = typeof arr[1] !== 'undefined' ? Number(arr[1]) : Number.NaN;
                if (Number.isNaN(to) || !Number.isFinite(to)) {
                  return [from];
                }

                return [from, to];
              }
            } catch {
              return [];
            }

            const number = value.length ? Number(value) : Number.NaN;
            if (!Number.isNaN(number) && Number.isFinite(number)) {
              return [number];
            }

            return [];
          },
          toAttribute: (value) => {
            if (!Array.isArray(value) || typeof value[0] === 'undefined') {
              return '';
            }

            if (typeof value[1] === 'undefined') {
              return value[0].toString();
            }

            return JSON.stringify(value);
          },
        },
      },
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
    };
  }

  static get styles() {
    return inputSliderStyles;
  }

  static get CLASS_NAME() {
    return 'input-slider';
  }

  get from() {
    return typeof this.value[0] === 'undefined' ? (this.max - this.min) / 2 : this.value[0];
  }

  get to() {
    return typeof this.value[1] === 'undefined' ? null : this.value[1];
  }

  set from(from) {
    this.value = typeof this.value[1] === 'undefined' ? [from] : [from, this.value[1]];
  }

  set to(to) {
    this.value = [this.from, to];
  }

  constructor() {
    super();

    // Default properties
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.value = [];

    this.sliderState = SLIDER_STATE.NOT_SLIDING;
  }

  /**
   * Reschedule update
   */
  async performUpdate() {
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    super.performUpdate();
  }

  /**
   * Keep focus on corresponding input to keep sliding when intersection occurs
   * @param {Map} changedProps
   */
  updated(changedProps) {
    // First render, do nothing
    const value = changedProps.get('value');
    if (!value || value.length === 0) {
      return;
    }

    if (value[0] !== this.value[0]) {
      this.shadowRoot.querySelector('input[name="from"]').focus();
    }

    if (value[1] !== this.value[1]) {
      this.shadowRoot.querySelector('input[name="to"]').focus();
    }
  }

  /**
   * Update value
   * @param {Event} ev
   */
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
        const isSetToInsideRange = newValue > (to - from) / 2 + from;

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

    // Start an update
    this.performUpdate();
  }

  handleChange() {
    this.dispatchEvent(new Event('change'));
  }

  resetSliding() {
    this.sliderState = SLIDER_STATE.NOT_SLIDING;
  }

  stepDown() {
    this.stepFromDown();
  }

  stepUp() {
    this.stepFromUp();
  }

  stepFromDown() {
    const { from, min, step } = this;
    this.from = Math.max(min, from - step);
  }

  stepFromUp() {
    const { from, to, max, step } = this;
    this.from = Math.min(max, to === null ? Number.POSITIVE_INFINITY : to, from + step);
  }

  stepToDown() {
    const { from, to, step } = this;
    if (to !== null) {
      this.to = Math.max(from, to - step);
    }
  }

  stepToUp() {
    const { to, max, step } = this;
    if (to !== null) {
      this.to = Math.min(max, to + step);
    }
  }

  renderInput(name, value) {
    const { min, max, step } = this;

    const classes = [
      `${this.constructor.CLASS_NAME}__input`, //
      `${this.constructor.CLASS_NAME}__input--${name}`,
    ];

    return html`<input
      type="range"
      min=${min}
      max=${max}
      step=${step}
      name=${name}
      .value=${live(value)}
      class=${classes.join(' ')}
      @change=${this.handleChange}
    />`;
  }

  render() {
    const { from, to, min, max } = this;
    const isRange = to !== null;

    const styles = {
      '--from': isRange ? from : min,
      '--to': isRange ? to : from,
      '--min': min,
      '--max': max,
    };

    return html`
      <div
        class=${this.constructor.CLASS_NAME}
        style=${styleMap(styles)}
        @input=${this.handleInput}
        @pointerup=${this.resetSliding}
        @keyup=${this.resetSliding}
      >
        <!-- From -->
        ${this.renderInput('from', from)}
        <!-- To -->
        ${isRange ? this.renderInput('to', to) : null}
      </div>
    `;
  }
}

customElements.define('input-slider', InputSlider);
