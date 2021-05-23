import { html, TemplateResult } from 'lit-html';
import '../input-range-slider.js';

export default {
  title: 'InputRangeSlider',
  component: 'input-range-slider',
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    primaryColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  value?: string;
  min?: number;
  max?: number;
  step?: number;
  primaryColor?: string;
}

const Template: Story<ArgTypes> = ({ value, min = 0, max = 100, step = 1, primaryColor }: ArgTypes) => html`
  <input-range-slider
    style="${primaryColor ? `--color-primary: ${primaryColor}` : ''}"
    value=${value}
    min=${min}
    max=${max}
    step=${step}
  ></input-range-slider>
`;

export const Regular = Template.bind({});

export const RangeSlider = Template.bind({});
RangeSlider.args = {
  value: '[10, 50]',
};
