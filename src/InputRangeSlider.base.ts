export enum SLIDER_STATE {
  NOT_SLIDING = 'NOT_SLIDING',
  SLIDING_FROM = 'SLIDING_FROM',
  SLIDING_TO = 'SLIDING_TO',
}

type Constructor<T = {}> = new (...args: any[]) => T;

const InputRangeSliderBase = <TBase extends Constructor<HTMLElement>>(Base: TBase) =>
  class extends Base {
    #value: number[] = [];

    #min: number = 0;

    #max: number = 100;

    #step: number = 1;

    #sliderState: SLIDER_STATE = SLIDER_STATE.NOT_SLIDING;

    get from() {
      return typeof this.value[0] === 'undefined' ? (this.#max - this.#min) / 2 : this.value[0];
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

    get value() {
      return this.#value;
    }

    set value(value: number[]) {
      this.#value = value;
    }

    get min() {
      return this.#min;
    }

    get max() {
      return this.#max;
    }

    get step() {
      return this.#step;
    }

    get state() {
      return this.#sliderState;
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
        (name === 'from' && this.#sliderState !== SLIDER_STATE.SLIDING_TO) ||
        this.#sliderState === SLIDER_STATE.SLIDING_FROM
      ) {
        // All clicks on the track will always be handled by `from` input
        if (this.#sliderState === SLIDER_STATE.NOT_SLIDING) {
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
        this.#sliderState = newValue < to ? SLIDER_STATE.SLIDING_FROM : SLIDER_STATE.SLIDING_TO;
      } else {
        if (newValue < from) {
          // Force direction change if newValue > prevValue + 1
          this.value = [newValue, from];
        } else {
          this.to = newValue;
        }

        // Change slider direction when newValue === from
        this.#sliderState = newValue > from ? SLIDER_STATE.SLIDING_TO : SLIDER_STATE.SLIDING_FROM;
      }

      // Start an update
      this.performUpdate();
    }

    performUpdate() {
      // @ts-ignore
      if (super.performUpdate) {
        // @ts-ignore
        super.performUpdate();
      }
    }

    handleChange() {
      this.dispatchEvent(new Event('change'));
    }

    resetSliderState() {
      this.#sliderState = SLIDER_STATE.NOT_SLIDING;
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

    static fromValueAttr(valueAttr: string): number[] {
      try {
        const value = JSON.parse(valueAttr);

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
        // Do nothing
      }

      return [];
    }

    static toValueAttr(value: number[]) {
      if (typeof value[0] === 'undefined') {
        return '';
      }

      if (typeof value[1] === 'undefined') {
        return value[0].toString();
      }

      return JSON.stringify(value);
    }
  };

export default InputRangeSliderBase;
