import template, { BASE_CLASS_NAME } from './InputRangeSlider.template';

enum SLIDER_STATE {
  NOT_SLIDING = 'NOT_SLIDING',
  SLIDING_FROM = 'SLIDING_FROM',
  SLIDING_TO = 'SLIDING_TO',
}

export class InputRangeSlider extends HTMLElement {
  private sliderState: SLIDER_STATE;

  get value(): number[] {
    try {
      const value = JSON.parse(this.getAttribute('value') || '');

      if (Array.isArray(value)) {
        const [from, to] = value;

        if (!Number.isSafeInteger(from)) {
          return [];
        }

        if (!Number.isSafeInteger(to)) {
          return [from];
        }

        return [from, to];
      }

      if (Number.isSafeInteger(value)) {
        return [value];
      }
    } catch {
      return [];
    }

    return [];
  }

  set value(value) {
    if (!Array.isArray(value) || typeof value[0] === 'undefined') {
      this.setAttribute('value', '');
    }

    if (typeof value[1] === 'undefined') {
      this.setAttribute('value', value[0].toString());
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
    this.value = to === null ? [this.from] : [this.from, to];
  }

  get min() {
    return this.getNumericAttribute('min', 0);
  }

  get max() {
    return this.getNumericAttribute('max', 100);
  }

  get step() {
    return this.getNumericAttribute('step', 1);
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.sliderState = SLIDER_STATE.NOT_SLIDING;

    // Initialize
    this.performUpdate();

    const root = this.shadowRoot?.querySelector('div');
    root?.addEventListener('input', this.handleInput.bind(this));
    root?.addEventListener('pointerup', this.resetSliderState.bind(this));
    root?.addEventListener('keyup', this.resetSliderState.bind(this));

    // Fire change event on custom element
    root?.addEventListener('change', this.handleChange.bind(this));
  }

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

  performInputUpdate(name: string, value: number) {
    const input = this.shadowRoot?.querySelector<HTMLInputElement>(`input[name="${name}"]`);

    if (!input) {
      return;
    }

    input.setAttribute('min', this.min.toString());
    input.setAttribute('max', this.max.toString());
    input.setAttribute('step', this.step.toString());

    input.value = value.toString();
    input.setAttribute('value', value.toString());

    input.removeAttribute('hidden');
  }

  performUpdate() {
    const { from, to, min, max } = this;

    const root = this.shadowRoot?.querySelector('div');
    root?.style.setProperty('--from', (to !== null ? from : min).toString());
    root?.style.setProperty('--to', (to !== null ? to : from).toString());
    root?.style.setProperty('--min', min.toString());
    root?.style.setProperty('--max', max.toString());

    root?.classList[this.sliderState !== SLIDER_STATE.NOT_SLIDING ? 'add' : 'remove'](`${BASE_CLASS_NAME}--sliding`);

    this.performInputUpdate('from', from);

    if (to !== null) {
      this.performInputUpdate('to', to);
    }
  }

  private getNumericAttribute(name: string, defaultValue = 0) {
    if (!this.hasAttribute(name)) {
      return defaultValue;
    }

    const value = Number(this.getAttribute(name));

    if (!Number.isSafeInteger(value)) {
      return defaultValue;
    }

    return value;
  }
}
