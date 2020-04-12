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
      from: { type: Number },
      to: { type: Number },
      min: { type: Number },
      max: { type: Number },
    };
  }

  static get styles() {
    return inputSliderStyles;
  }

  static get CLASS_NAME() {
    return 'input-slider';
  }

  constructor() {
    super();

    // Properties
    this.min = 0;
    this.max = 100;
    this.from = 0;
    this.to = 100;

    this.sliderState = SLIDER_STATE.NOT_SLIDING;
  }

  async performUpdate() {
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    super.performUpdate();
  }

  updated(changedProps) {
    // First render
    if (changedProps.has('from') && changedProps.has('to')) {
      return;
    }

    if (changedProps.has('from')) {
      this.shadowRoot.querySelector('input[name="from"]').focus();
    }

    if (changedProps.has('to')) {
      this.shadowRoot.querySelector('input[name="to"]').focus();
    }
  }

  handleChange(ev) {
    const { target } = ev;
    const { name } = target;

    const from = this.from;
    const to = this.to;

    const value = Number(target.value);

    if (
      (name === 'from' && this.sliderState !== SLIDER_STATE.SLIDING_TO) ||
      this.sliderState === SLIDER_STATE.SLIDING_FROM
    ) {
      // All clicks on the track will always be handled by `from` input
      if (this.sliderState === SLIDER_STATE.NOT_SLIDING) {
        // Click on the second half of the range
        // ------o=======x==o------
        const isSetToInsideRange = value > (to - from) / 2 + from;

        // Click on the right outside range
        // ------o===========o--x---
        const isSetToOutsideRange = value > to;

        if (isSetToInsideRange || isSetToOutsideRange) {
          this.to = value;
          this.performUpdate();
          return;
        }
      }

      if (value > to) {
        // Force direction change if value > prevValue + 1
        this.from = to;
        this.to = value;
      } else {
        this.from = value;
      }

      // Change slider direction when value === to
      this.sliderState = value < to ? SLIDER_STATE.SLIDING_FROM : SLIDER_STATE.SLIDING_TO;
    } else {
      if (value < from) {
        this.to = from;
        this.from = value;
      } else {
        this.to = value;
      }

      // Change slider direction when value === from
      this.sliderState = value > from ? SLIDER_STATE.SLIDING_TO : SLIDER_STATE.SLIDING_FROM;
    }

    this.performUpdate();
  }

  resetSliding() {
    this.sliderState = SLIDER_STATE.NOT_SLIDING;
  }

  renderInput(name, value) {
    const classes = [
      `${this.constructor.CLASS_NAME}__input`, //
      `${this.constructor.CLASS_NAME}__input--${name}`,
    ];
    return html`<input type="range" name=${name} .value=${live(value)} class=${classes.join(' ')} />`;
  }

  render() {
    const styles = {
      '--from': this.from,
      '--to': this.to,
      '--min': this.min,
      '--max': this.max,
    };

    return html`
      <div
        class=${this.constructor.CLASS_NAME}
        style=${styleMap(styles)}
        @input=${this.handleChange}
        @pointerup=${this.resetSliding}
        @keyup=${this.resetSliding}
      >
        <!-- From -->
        ${this.renderInput('from', this.from)}
        <!-- To -->
        ${this.renderInput('to', this.to)}
      </div>
    `;
  }
}

customElements.define('input-slider', InputSlider);
