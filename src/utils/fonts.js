import { PixelRatio } from 'react-native';
import { deviceHeight, deviceWidth } from './constants';

export const sizes = {
  base: normalize(14),
  h1: normalize(32),
  h2: normalize(24),
  h3: normalize(20),
  h4: normalize(18),
  h5: normalize(16),
  h6: normalize(12),
  h7: normalize(10),
  h8: normalize(8),
};


export function normalize(size) {
  return size / PixelRatio.getFontScale();
}

export const wp = widthPercent => {
  const elemWidth =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((deviceWidth * elemWidth) / 100);
};

export const hp = heightPercent => {
  const elemHeight =
    typeof heightPercent === 'number'
      ? heightPercent
      : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((deviceHeight * elemHeight) / 100);
};
