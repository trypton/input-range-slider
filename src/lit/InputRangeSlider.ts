import { LitElement, html } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { live } from 'lit-html/directives/live';

import styles, { BASE_CLASS_NAME } from './InputRangeSlider.styles';

enum SLIDER_STATE {
  NOT_SLIDING = 'NOT_SLIDING',
  SLIDING_FROM = 'SLIDING_FROM',
  SLIDING_TO = 'SLIDING_TO',
}

export class InputRangeSlider extends LitElement {
  private value: number[];

  private min: number;

  private max: number;

  private step: number;

  private sliderState: SLIDER_STATE;

  static get properties() {
    return {
      value: {
        type: Array,
        reflect: true,
        converter: {
          fromAttribute: (value: string) => {
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
          },
          toAttribute: (value?: number[]) => {
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
    return styles;
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

  set to(to: number | null) {
    if (to === null) {
      this.value = [this.from];
      return;
    }

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

  /**
   * Update value
   * @param {Event} ev
   */
  handleInput(evt: Event) {
    const target = evt.target as HTMLInputElement;

    const { name, value } = target;

    if (!name || !value) {
      return;
    }

    const { from } = this;
    const to = this.to === null ? Number.POSITIVE_INFINITY : this.to;

    const newValue = Number(value);

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

  resetSliderState() {
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
