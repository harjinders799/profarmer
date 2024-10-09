import { Dimensions, Platform } from 'react-native';

export const WIDTH = Dimensions.get('screen').width;
export const HEIGHT = Dimensions.get('screen').height;
export const deviceWidth = Dimensions.get("window").width;
export const deviceHeight = Dimensions.get("window").height;
export const isIOS = Platform.OS === 'ios'
export const LOGO = 'https://firebasestorage.googleapis.com/v0/b/pro--farmer.appspot.com/o/ic_launcher_round.png?alt=media&token=986624f5-9296-4d01-b368-99b5f3697926'