import { css, unsafeCSS } from 'lit-element';

export const BASE_CLASS_NAME = 'input-range-slider';

const className = unsafeCSS(BASE_CLASS_NAME);

enum BROWSER_PREFIX {
  WEBKIT = 'WEBKIT',
  MOZ = 'MOZ',
}

const trackBrowserPrefixes = {
  [BROWSER_PREFIX.WEBKIT]: '-webkit-slider-runnable-track',
  [BROWSER_PREFIX.MOZ]: '-moz-range-track',
};

const thumbBrowserPrefixes = {
  [BROWSER_PREFIX.WEBKIT]: '-webkit-slider-thumb',
  [BROWSER_PREFIX.MOZ]: '-moz-range-thumb',
};

const trackStyle = (browser: BROWSER_PREFIX) => {
  const prefix = unsafeCSS(trackBrowserPrefixes[browser]);
  return css`
    .${className}__input::${prefix} {
      background: linear-gradient(
        90deg,
        var(--input-range-slider-color-track) var(--input-range-slider-track-from, 0%),
        var(--input-range-slider-color-fill) 0 var(--input-range-slider-track-to, 100%),
        var(--input-range-slider-color-track) 0
      );
      border-radius: 1px;
      height: var(--input-range-slider-track-height);
      width: 100%;
    }

    .${className}__input--from::${prefix} {
      pointer-events: auto;
    }

    .${className}__input--to::${prefix} {
      background: transparent;
    }
  `;
};

const thumbStyle = (browser: BROWSER_PREFIX) => {
  const prefix = unsafeCSS(thumbBrowserPrefixes[browser]);
  return css`
    .${className}__input::${prefix} {
      appearance: none;
      background-color: var(--input-range-slider-color-thumb);
      border: none;
      border-radius: var(--input-range-slider-thumb-size);
      height: var(--input-range-slider-thumb-size);
      margin-top: calc((var(--input-range-slider-thumb-size) / -2) + (var(--input-range-slider-track-height) / 2));
      position: relative;
      pointer-events: auto;
      transition: all 0.5s ease-out;
      width: var(--input-range-slider-thumb-size);
    }

    .${className}__input:focus::${prefix} {
      box-shadow: 0px 0px 1px 3px var(--input-range-slider-color-outline);
    }

    .${className}__input:active::${prefix} {
      transform: scale(1.15);
    }
  `;
};

const styles = css`
  :host {
    --input-range-slider-color-primary: #3f51b5;
    --input-range-slider-color-track: #eee;
    --input-range-slider-color-fill: var(--input-range-slider-color-primary);
    --input-range-slider-color-thumb: var(--input-range-slider-color-primary);
    --input-range-slider-color-outline: rgb(159 168 218 / 50%);
    --input-range-slider-track-height: 4px;
    --input-range-slider-thumb-size: 18px;

    display: inline-block;
    width: 100%;
  }

  .${className} {
    --input-range-slider-track-from: calc((var(--from) * 100%) / (var(--max) - var(--min)));
    --input-range-slider-track-to: calc((var(--to) * 100%) / (var(--max) - var(--min)));

    position: relative;
  }

  .${className}__input {
    appearance: none;
    background-color: transparent;
    cursor: pointer;
    height: 0;
    margin: 0;
    padding: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
  }

  /* Focus state re-applied on a thumb element */
  .${className}__input:focus {
    border: 0;
    outline: none;
  }

  /* Remove Firefox dotted border */
  .${className}__input::-moz-focus-outer {
    border: 0;
  }

  /* Webkit */
  ${trackStyle(BROWSER_PREFIX.WEBKIT)}
  ${thumbStyle(BROWSER_PREFIX.WEBKIT)}

  /* Firefox */
  ${trackStyle(BROWSER_PREFIX.MOZ)}
  ${thumbStyle(BROWSER_PREFIX.MOZ)}
`;

export default styles;
