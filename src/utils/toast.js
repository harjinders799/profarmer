import {showMessage as showMessageRNFM} from 'react-native-flash-message';
import {white, red, green, blue, yellow} from 'src/utils/color';

export let ToastError = (message, title = ' ') => {
  const backgroundColor = red;
  showMessageRNFM({
    backgroundColor,
    color: white,
    message: title,
    description: message,
    type: 'danger',
    duration: 3000,
  });
};

export let ToastSuccess = (message, title = ' ') => {
  const backgroundColor = green;
  showMessageRNFM({
    backgroundColor,
    color: white,
    message: title,
    description: message,
    type: 'success',
  });
};
