import { presetPalettes } from '@ant-design/colors';

const COLOR_KEYS = Object.keys(presetPalettes);
export const COLOR_COUNT = COLOR_KEYS.length;

/**
 * Picks a random color from the antd Colors package.
 * @param hue - Specify the preferred hue (between 1 and 10), defaults to 5
 * @return string
 */
// eslint-disable-next-line import/prefer-default-export
export const getRandomColor = (hue: number = 5): string => {
  const randomColorIndex = Math.floor(Math.random() * (COLOR_COUNT - 1));
  const randomColor = COLOR_KEYS[randomColorIndex];

  let hueIndex;
  if (hue < 1 || hue > 10) {
    hueIndex = 4;
  } else {
    hueIndex = hue - 1;
  }

  return presetPalettes[randomColor][hueIndex];
};

/**
 * Retrieve a color by index
 *
 * @param colorIndex - Index of the color, based on default ordering on `antd.colors.presetPalettes`
 * @param hue - Index of the hue, value between 0 and 9;
 */
export const getColorByIndex = (colorIndex: number, hue: number = 5): string => {
  const cIndex = colorIndex % COLOR_COUNT;
  const hIndex = hue % 10;

  return presetPalettes[COLOR_KEYS[cIndex]][hIndex];
};
