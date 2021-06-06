import { html, fixture, expect } from '@open-wc/testing';

import { InputRangeSlider } from '../src/InputRangeSlider.js';
import '../input-range-slider.js';

describe('InputRangeSlider', () => {
  describe('Attributes', () => {
    it('has default correct default values', async () => {
      const el = await fixture<InputRangeSlider>(html`<input-range-slider></input-range-slider>`);

      expect(el.from).to.equal(50);
      expect(el.to).to.equal(null);
      expect(el.min).to.equal(0);
      expect(el.max).to.equal(100);
      expect(el.step).to.equal(1);
    });

    it('can set single value via attribute', async () => {
      const el = await fixture<InputRangeSlider>(html`<input-range-slider value="10"></input-range-slider>`);

      expect(el.from).to.equal(10);
      expect(el.to).to.equal(null);
    });

    it('can set values range via attribute', async () => {
      const el = await fixture<InputRangeSlider>(html`<input-range-slider value="[10, 50]"></input-range-slider>`);

      expect(el.from).to.equal(10);
      expect(el.to).to.equal(50);
    });

    it('can set min value via attribute', async () => {
      const el = await fixture<InputRangeSlider>(html`<input-range-slider min="10"></input-range-slider>`);

      expect(el.min).to.equal(10);
    });

    it('can set max value via attribute', async () => {
      const el = await fixture<InputRangeSlider>(html`<input-range-slider max="90"></input-range-slider>`);

      expect(el.max).to.equal(90);
    });

    it('can set step value via attribute', async () => {
      const el = await fixture<InputRangeSlider>(html`<input-range-slider step="10"></input-range-slider>`);

      expect(el.step).to.equal(10);
    });
  });

  describe('API', () => {
    it('can decrease value with stepDown', async () => {
      const el = await fixture<InputRangeSlider>(html`<input-range-slider value="50"></input-range-slider>`);
      el.stepDown();

      expect(el.from).to.equal(49);
      expect(el.to).to.equal(null);
    });

    it('can increase value with stepUp', async () => {
      const el = await fixture<InputRangeSlider>(html`<input-range-slider value="50"></input-range-slider>`);
      el.stepUp();

      expect(el.from).to.equal(51);
      expect(el.to).to.equal(null);
    });

    it('can increase range with stepFromDown', async () => {
      const el = await fixture<InputRangeSlider>(html`<input-range-slider value="[10,50]"></input-range-slider>`);
      el.stepFromDown();

      expect(el.from).to.equal(9);
      expect(el.to).to.equal(50);
    });

    it('can decrease range with stepFromUp', async () => {
      const el = await fixture<InputRangeSlider>(html`<input-range-slider value="[10,50]"></input-range-slider>`);
      el.stepFromUp();

      expect(el.from).to.equal(11);
      expect(el.to).to.equal(50);
    });

    it('can decrease range with stepToDown', async () => {
      const el = await fixture<InputRangeSlider>(html`<input-range-slider value="[10,50]"></input-range-slider>`);
      el.stepToDown();

      expect(el.from).to.equal(10);
      expect(el.to).to.equal(49);
    });

    it('can increase range with stepToUp', async () => {
      const el = await fixture<InputRangeSlider>(html`<input-range-slider value="[10,50]"></input-range-slider>`);
      el.stepToUp();

      expect(el.from).to.equal(10);
      expect(el.to).to.equal(51);
    });
  });

  it.skip('passes the a11y audit', async () => {
    const el = await fixture<InputRangeSlider>(html`<input-range-slider></input-range-slider>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
