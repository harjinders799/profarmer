import { Dimensions, Platform } from 'react-native';

export const WIDTH = Dimensions.get('screen').width;
export const HEIGHT = Dimensions.get('screen').height;
export const isIOS = Platform.OS === 'ios'
