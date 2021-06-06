# \<input-range-slider>

Custom input[type=range] element with min and max values support.

Both native and lit element implementations are available.

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
# TBD
```

## Usage

### Native implementation

```html
<script type="module">
  import 'input-range-slider/input-range-slider.js';
</script>

<input-range-slider></input-range-slider>
```

### LitElement implementation

```html
<script type="module">
  import 'input-range-slider/lit/input-range-slider.js';
</script>

<input-range-slider></input-range-slider>
```

### Using different tag name

```html
<script type="module">
  import InputRangeSlider from 'input-range-slider';
  // OR
  // import InputRangeSlider from 'input-range-slider/lit';

  window.customElements.define('input-range', InputRangeSlider);
</script>

<input-range></input-range>
```

### Supported attributes

| Attr  | Type                      | Default |
| ----- | ------------------------- | ------- |
| value | number / [number, number] | 50      |
| min   | number                    | 0       |
| max   | number                    | 100     |
| step  | number                    | 1       |

### Supported CSS custom properties

| Name                               | Default                                 |
| ---------------------------------- | --------------------------------------- |
| --input-range-slider-color-primary | #3f51b5                                 |
| --input-range-slider-color-track   | #eee                                    |
| --input-range-slider-color-fill    | var(--input-range-slider-color-primary) |
| --input-range-slider-color-thumb   | var(--input-range-slider-color-primary) |
| --input-range-slider-color-outline | rgb(159 168 218 / 50%)                  |
| --input-range-slider-track-height  | 4px                                     |
| --input-range-slider-thumb-size    | 18px                                    |

## Linting with ESLint, Prettier, and Types

To scan the project for linting errors, run

```bash
npm run lint
```

You can lint with ESLint and Prettier individually as well

```bash
npm run lint:eslint
```

```bash
npm run lint:prettier
```

To automatically fix many linting errors, run

```bash
npm run format
```

You can format using ESLint and Prettier individually as well

```bash
npm run format:eslint
```

```bash
npm run format:prettier
```

## Testing with Web Test Runner

To run the suite of Web Test Runner tests, run

```bash
npm run test
```

To run the tests in watch mode (for &lt;abbr title=&#34;test driven development&#34;&gt;TDD&lt;/abbr&gt;, for example), run

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
