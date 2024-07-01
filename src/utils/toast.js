import { showMessage as showMessageRNFM } from 'react-native-flash-message';
import { white, red, greenDark, blue, yellow } from 'src/utils/colors';

export let ToastError = (message, title = 'ProFarmer') => {
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
export let ToastProgress = (message, title = 'ProFarmer') => {
  const backgroundColor = blue;
  showMessageRNFM({
    backgroundColor,
    color: white,
    message: title,
    description: message,
    type: 'info',
    duration: 1000,
  });
};

export let ToastSuccess = (message, title = 'ProFarmer') => {
  const backgroundColor = greenDark;
  showMessageRNFM({
    backgroundColor,
    color: white,
    message: title,
    description: message,
    type: 'success',
    duration: 1000,
  });
};
