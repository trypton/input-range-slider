import { css, unsafeCSS } from 'lit-element';

const BROWSER_PREFIX = {
  WEBKIT: 'WEBKIT',
  MOZ: 'MOZ',
};

const trackBrowserPrefixes = {
  [BROWSER_PREFIX.WEBKIT]: '-webkit-slider-runnable-track',
  [BROWSER_PREFIX.MOZ]: '-moz-range-track',
};

const thumbBrowserPrefixes = {
  [BROWSER_PREFIX.WEBKIT]: '-webkit-slider-thumb',
  [BROWSER_PREFIX.MOZ]: '-moz-range-thumb',
};

const trackStyle = (browser) => {
  const prefix = unsafeCSS(trackBrowserPrefixes[browser]);

  return css`
    .input-slider__input::${prefix} {
      background: linear-gradient(
        90deg,
        var(--color-track) var(--track-from, 0%),
        var(--color-fill) 0 var(--track-to, 100%),
        var(--color-track) 0
      );
      border-radius: 1px;
      height: var(--track-height);
      width: 100%;
    }

    .input-slider__input--from::${prefix} {
      pointer-events: auto;
    }

    .input-slider__input--to::${prefix} {
      background: transparent;
    }
  `;
};

const thumbStyle = (browser) => {
  const prefix = unsafeCSS(thumbBrowserPrefixes[browser]);

  return css`
    .input-slider__input::${prefix} {
      -webkit-appearance: none;
      background-color: var(--color-fill);
      border: none;
      border-radius: var(--thumb-size);
      height: var(--thumb-size);
      margin-top: calc((var(--thumb-size) / -2) + (var(--track-height) / 2));
      position: relative;
      pointer-events: auto;
      transition: all 0.5s ease-out;
      width: var(--thumb-size);
    }

    .input-slider__input:focus::${prefix} {
      box-shadow: 0px 0px 1px 3px var(--color-outline);
    }

    .input-slider__input:active::${prefix} {
      transform: scale(1.15);
    }
  `;
};

export const inputSliderStyles = css`
  :host {
    --color-fill: #3f51b5;
    --color-outline: rgba(159, 168, 218, 0.5);
    --color-track: #eee;
    --track-height: 4px;
    --thumb-size: 18px;

    display: inline-block;
    width: 100%;
  }

  .input-slider {
    --track-from: calc((var(--from) * 100%) / (var(--max) - var(--min)));
    --track-to: calc((var(--to) * 100%) / (var(--max) - var(--min)));

    position: relative;
  }

  .input-slider__input {
    -webkit-appearance: none;
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
  .input-slider__input:focus {
    border: 0;
    outline: none;
  }

  /* Remove Firefox dotted border */
  .input-slider__input::-moz-focus-outer {
    border: 0;
  }

  /* Webkit */
  ${trackStyle(BROWSER_PREFIX.WEBKIT)}
  ${thumbStyle(BROWSER_PREFIX.WEBKIT)}

  /* Firefox */
  ${trackStyle(BROWSER_PREFIX.MOZ)}
  ${thumbStyle(BROWSER_PREFIX.MOZ)}
`;
