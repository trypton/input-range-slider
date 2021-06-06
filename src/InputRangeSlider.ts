import InputRangeSliderBase, { SLIDER_STATE } from './InputRangeSlider.base';
import template, { BASE_CLASS_NAME } from './InputRangeSlider.template';

export class InputRangeSlider extends InputRangeSliderBase(HTMLElement) {
  get value(): number[] {
    return InputRangeSlider.fromValueAttr(this.getAttribute('value') || '');
  }

  set value(value) {
    this.setAttribute('value', InputRangeSlider.toValueAttr(value));
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

    // Initialize
    this.performUpdate();

    const root = this.shadowRoot?.querySelector('div');
    root?.addEventListener('input', this.handleInput.bind(this));
    root?.addEventListener('pointerup', this.resetSliderState.bind(this));
    root?.addEventListener('keyup', this.resetSliderState.bind(this));

    // Fire change event on custom element
    root?.addEventListener('change', this.handleChange.bind(this));
  }

  resetSliderState() {
    super.resetSliderState();
    this.performUpdate();
  }

  connectedCallback() {
    this.resetSliderState();
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

    root?.classList[this.state !== SLIDER_STATE.NOT_SLIDING ? 'add' : 'remove'](`${BASE_CLASS_NAME}--sliding`);

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
