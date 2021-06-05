export const BASE_CLASS_NAME = 'input-range-slider';

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

const trackCss = (browser: BROWSER_PREFIX) => {
  const prefix = trackBrowserPrefixes[browser];
  return `
    .${BASE_CLASS_NAME}__input::${prefix} {
      background: linear-gradient(
        90deg,
        var(--input-slider-range-color-track) var(--input-slider-range-track-from, 0%),
        var(--input-slider-range-color-fill) 0 var(--input-slider-range-track-to, 100%),
        var(--input-slider-range-color-track) 0
      );
      border-radius: 1px;
      height: var(--input-slider-range-track-height);
      width: 100%;
    }

    .${BASE_CLASS_NAME}__input--from::${prefix} {
      pointer-events: auto;
    }

    .${BASE_CLASS_NAME}__input--to::${prefix} {
      background: transparent;
    }
  `;
};

const thumbCss = (browser: BROWSER_PREFIX) => {
  const prefix = thumbBrowserPrefixes[browser];
  return `
    .${BASE_CLASS_NAME}__input::${prefix} {
      -webkit-appearance: none;
      background-color: var(--input-slider-range-color-thumb);
      border: none;
      border-radius: var(--input-slider-range-thumb-size);
      height: var(--input-slider-range-thumb-size);
      margin-top: calc((var(--input-slider-range-thumb-size) / -2) + (var(--input-slider-range-track-height) / 2));
      position: relative;
      pointer-events: auto;
      transition: all 0.5s ease-out;
      width: var(--input-slider-range-thumb-size);
      z-index: 1;
    }

    .${BASE_CLASS_NAME}--sliding .${BASE_CLASS_NAME}__input::${prefix},
    .${BASE_CLASS_NAME}__input:focus::${prefix} {
      box-shadow: 0px 0px 1px 3px var(--input-slider-range-color-outline);
    }

    .${BASE_CLASS_NAME}--sliding .${BASE_CLASS_NAME}__input::${prefix},
    .${BASE_CLASS_NAME}__input:active::${prefix} {
      transform: scale(1.15);
    }
  `;
};

const inputHtml = ({ name, hidden = false }: { name: string; hidden?: boolean }) => {
  const classes = [`${BASE_CLASS_NAME}__input`, `${BASE_CLASS_NAME}__input--${name}`];
  return `<input type="range" name="${name}" class="${classes.join(' ')}" ${hidden ? 'hidden' : ''} />`;
};

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      --input-slider-range-color-primary: #3f51b5;
      --input-slider-range-color-track: #eee;
      --input-slider-range-color-fill: var(--input-slider-range-color-primary);
      --input-slider-range-color-thumb: var(--input-slider-range-color-primary);
      --input-slider-range-color-outline: rgb(159 168 218 / 50%);
      --input-slider-range-track-height: 4px;
      --input-slider-range-thumb-size: 18px;

      display: inline-block;
      width: 100%;
    }

    .${BASE_CLASS_NAME} {
      --input-slider-range-track-from: calc((var(--from) * 100%) / (var(--max) - var(--min)));
      --input-slider-range-track-to: calc((var(--to) * 100%) / (var(--max) - var(--min)));

      position: relative;
    }

    .${BASE_CLASS_NAME}__input {
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
    .${BASE_CLASS_NAME}__input:focus {
      border: 0;
      outline: none;
    }

    /* Remove Firefox dotted border */
    .${BASE_CLASS_NAME}__input::-moz-focus-outer {
      border: 0;
    }

    /* Webkit */
    ${trackCss(BROWSER_PREFIX.WEBKIT)}
    ${thumbCss(BROWSER_PREFIX.WEBKIT)}

    /* Firefox */
    ${trackCss(BROWSER_PREFIX.MOZ)}
    ${thumbCss(BROWSER_PREFIX.MOZ)}
  </style>

  <div class="${BASE_CLASS_NAME}">
    ${inputHtml({ name: 'from' })}
    ${inputHtml({ name: 'to', hidden: true })}
  </div>
`;

export default template;
