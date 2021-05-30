import { LitElement, html } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { live } from 'lit-html/directives/live';

import InputRangeSliderBase from '../InputRangeSlider.base';
import styles, { BASE_CLASS_NAME } from './InputRangeSlider.styles';

export class InputRangeSlider extends InputRangeSliderBase(LitElement) {
  #min: number = 0;

  #max: number = 100;

  #step: number = 1;

  static get properties() {
    return {
      value: {
        type: Array,
        reflect: true,
        converter: {
          fromAttribute: (value: string) => InputRangeSlider.fromValueAttr(value),
          toAttribute: (value: number[]) => InputRangeSlider.toValueAttr(value),
        },
      },
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
    };
  }

  static get styles() {
    return styles;
  }

  get min() {
    return this.#min;
  }

  set min(value: number) {
    const oldValue = this.#min;
    this.#min = value;
    this.requestUpdate('min', oldValue);
  }

  get max() {
    return this.#max;
  }

  set max(value: number) {
    const oldValue = this.#max;
    this.#max = value;
    this.requestUpdate('max', oldValue);
  }

  get step() {
    return this.#step;
  }

  set step(value: number) {
    const oldValue = this.#step;
    this.#step = value;
    this.requestUpdate('step', oldValue);
  }

  constructor() {
    super();

    // Default properties
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.value = [];
  }

  /**
   * Reschedule update
   */
  async performUpdate() {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    super.performUpdate();
  }

  /**
   * Keep focus on corresponding input to keep sliding when intersection occurs
   * @param {Map} changedProps
   */
  updated(changedProps: Map<string | number | symbol, unknown>) {
    // First render, do nothing
    const value = changedProps.get('value') as undefined | number[];
    if (!value || value.length === 0) {
      return;
    }

    if (value[0] !== this.value[0]) {
      const from = this.shadowRoot?.querySelector('input[name="from"]');
      if (from instanceof HTMLElement) {
        from.focus();
      }
    }

    if (value[1] !== this.value[1]) {
      const to = this.shadowRoot?.querySelector('input[name="to"]');
      if (to instanceof HTMLElement) {
        to.focus();
      }
    }
  }

  renderInput(name: string, value: number) {
    const { min, max, step } = this;

    const classes = [
      `${BASE_CLASS_NAME}__input`, //
      `${BASE_CLASS_NAME}__input--${name}`,
    ];

    return html`<input
      type="range"
      min=${min}
      max=${max}
      step=${step}
      name=${name}
      aria-label="input range ${name}"
      .value=${live(value)}
      class=${classes.join(' ')}
      @change=${this.handleChange}
    />`;
  }

  render() {
    const { from, to, min, max } = this;

    const style = {
      '--from': (to !== null ? from : min).toString(),
      '--to': (to !== null ? to : from).toString(),
      '--min': min.toString(),
      '--max': max.toString(),
    };

    return html`
      <div
        class=${BASE_CLASS_NAME}
        style=${styleMap(style)}
        @input=${this.handleInput}
        @pointerup=${this.resetSliderState}
        @keyup=${this.resetSliderState}
      >
        <!-- From -->
        ${this.renderInput('from', from)}
        <!-- To -->
        ${to !== null ? this.renderInput('to', to) : null}
      </div>
    `;
  }
}
