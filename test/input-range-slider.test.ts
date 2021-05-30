import { html, fixture, expect } from '@open-wc/testing';

import { InputRangeSlider } from '../src/InputRangeSlider.js';
import '../input-range-slider.js';

describe('InputRangeSlider', () => {
  it('has default from value set to 50 and to value set to null', async () => {
    const el = await fixture<InputRangeSlider>(html`<input-range-slider></input-range-slider>`);

    expect(el.from).to.equal(50);
    expect(el.to).to.equal(null);
  });

  // it('increases the counter on button click', async () => {
  //   const el = await fixture<InputRangeSlider>(html`<input-range-slider></input-range-slider>`);
  //   el.shadowRoot!.querySelector('button')!.click();

  //   expect(el.counter).to.equal(6);
  // });

  it('can set single value via attribute', async () => {
    const el = await fixture<InputRangeSlider>(html`<input-range-slider value="10"></input-range-slider>`);

    expect(el.from).to.equal(10);
    expect(el.to).to.equal(null);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<InputRangeSlider>(html`<input-range-slider></input-range-slider>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
