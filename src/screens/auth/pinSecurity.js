import React, {Component, useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Input from 'src/components/input';
import {goBack} from '../../navigation/ref';
import Text from 'src/components/text';
import Button from 'src/components/button';
import {strings} from 'src/translations/locale';
import {black, cyan, green, red, white} from '../../utils/color';
import {useLang} from '../../context/langContext';
import {useAuth} from '../../context/authContext';

import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {ToastError, ToastSuccess} from 'src/utils/toast';

const rnBiometrics = new ReactNativeBiometrics();

export default function PinSecurity({navigation}) {
  const {getPin, setPin} = useAuth();
  const [enteredPin, setEnteredPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [verifiedPin, setVerifiedPin] = useState('');
  const [label, setLabel] = useState('Enter');
  const {lang, setFingerLock, fingerLock} = useLang();
  const [isBiometry, setIsBiometry] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(false); 
  const [backgroundColor, setBackgroundColor] = useState(cyan); // Set the default color to cyan


  useEffect(() => {
    if (label === 'Enter' && enteredPin.length === 4) {
      setLabel('Confirm');
      setConfirmPin('');
    }

    if (label === 'Confirm' && confirmPin.length === 4) {
      if (enteredPin === confirmPin) {
        setPin(enteredPin);
        navigation.navigate('AddLoan');
      } else {
        console.log('PINs do not match');
        ToastError('PIN does not match');
      }
    }
  }, [enteredPin, confirmPin, label]);

  const handleKeyPress = key => {
    if (label === 'Enter' && enteredPin.length < 4) {
      setEnteredPin(enteredPin + key);
    } else if (label === 'Confirm' && confirmPin.length < 4) {
      setConfirmPin(confirmPin + key); setBackgroundColor('cyan')
    }
  };

  console.log('enteredPin:', enteredPin, '--11--');
  const handleBackspace = () => {
    if (label === 'Enter' && enteredPin.length > 0) {
      setEnteredPin(enteredPin.slice(0, -1));
    } else if (label === 'Confirm' && confirmPin.length > 0) {
      setConfirmPin(confirmPin.slice(0, -1));
    } else if (label === 'Verify' && verifiedPin.length > 0) {
      setVerifiedPin(verifiedPin.slice(0, -1));
    }
  };
  console.log('enteredPin:', enteredPin, '--1221--');
  // useEffect(() => {
  //     if (
  //       enteredPin.length > 0 ||
  //       confirmedPin.length > 0 ||
  //       verifiedPin.length > 0
  //     ) {
  //       setShowRemoveButton(true);
  //     } else {
  //       setShowRemoveButton(false);
  //     }
  //     console.log('enteredPin:', enteredPin,'--33--');
  //     if (enteredPin.length === 4 && label === 'Enter') {
  //       setTimeout(() => {
  //         clearAllPins();
  //       }, 500);
  //       setLabel('Confirm');
  //     }console.log('Reached the if statement');
  //     console.log('confirmedPin:', confirmedPin);

  // console.log('enteredPin:', enteredPin,'--144--');
  //     if (confirmedPin.length === 4 && label === 'Confirm') {
  //       if (confirmedPin === enteredPin) {
  //         console.log('confirmedPin:', confirmedPin);
  //         setPin(confirmedPin);
  //           // setUserVerified();
  //         navigation.replace('AddLoan'); // Navigate to the next screen
  //       } else {
  //           ToastError('PIN does not match');
  //       }
  //       setTimeout(() => {
  //         clearAllPins();
  //       }, 500);
  //     }
  //     if (verifiedPin.length === 4 && label === 'Verify') {
  //       if (verifiedPin === pin) {
  //          // setUserVerified();
  //         // navigation.replace('Dashboard'); // Navigate to the next screen
  //       } else {
  //         if (attempt <= 1) {
  //           ToastError('You have exceeded the maximum attempts');
  //           resetPin();
  //           resetUser();
  //         } else {
  //           ToastError('PIN does not match');
  //           setAttempt(attempt - 1);
  //         }
  //       }
  //       setTimeout(() => {
  //         clearAllPins();
  //       }, 500);
  //     }
  //   }, [enteredPin, confirmedPin, verifiedPin]);

  //   const onChangePin = (value) => {
  //     switch (label) {
  //       case 'Enter':
  //         setEnteredPin(value);
  //         break;
  //       case 'Confirm':
  //         setConfirmedPin(value);
  //         break;
  //       case 'Verify':
  //         setVerifiedPin(value);
  //         break;
  //     }
  //   };

  //   const clearAllPins = () => {
  //     setEnteredPin('');
  //     setConfirmedPin('');
  //     setVerifiedPin('');
  //   };

  // const authenticateWithBiometrics = async (biometryType) => {
  //   try {
  //     const { available } = await ReactNativeBiometrics.isSensorAvailable();

  //     if (available) {
  //       const result = await ReactNativeBiometrics.simplePrompt({
  //         promptMessage: `Authenticate with ${biometryType}`,
  //       });

  //       if (result.success) {
  //         // Biometric authentication successful, navigate back
  //         navigation.goBack();
  //       } else {
  //         // Biometric authentication failed, handle this appropriately.
  //       }
  //     } else {
  //       // Biometry not available.
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text h2 style={{color: cyan}}>
        {label === strings.enter
          ? strings.enter_pin
          : label === strings.confirm
          ? strings.confirm_pin
          : strings.verify_pin}
      </Text>
          {console.log('label:', label)}
      <View style={[styles.displayArea]}>
        {Array(4)
          .fill()
          .map((_, index) => (
            <View key={index} style={[styles.dot,]}>
              {index < enteredPin.length ||
              index < confirmPin.length ||
              index < verifiedPin.length ? (
                <View
                  style={[styles.enteredDot,
                    { backgroundColor: label === 'Confirm' ? white : cyan }
                ]}
                />
              ) : (
                ''
              )}
            </View>
          ))}
          {console.log('label:', label)}
      </View>
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0].map(key => (
          <TouchableOpacity
            key={key}
            style={styles.keyButton}
            onPress={() =>
              key === 'C' ? handleBackspace() : handleKeyPress(key)
            }>
            <Text h2 style={{color: cyan}}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* {isBiometry ? (
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('AboutUs')}>
          <Text style={styles.txt}>Finger Lock</Text>
          <Switch
            value={fingerLock}
            trackColor={{false: '#767577', true: black}}
            thumbColor={fingerLock ? green : '#f4f3f4'}
            onValueChange={() => setFingerLock(!fingerLock)}
          />
        </TouchableOpacity>
      ) : null} */}
      {isBiometry ? (
        <TouchableOpacity
          style={styles.row}
          onPress={() => authenticateWithBiometrics('Fingerprint')}>
          <Text style={styles.txt}>Fingerprint</Text>
        </TouchableOpacity>
      ) : null}
      {isBiometry ? (
        <TouchableOpacity
          style={styles.row}
          onPress={() => authenticateWithBiometrics('Face ID')}>
          <Text style={styles.txt}>Face ID</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
  },
  displayArea: {
    alignItems: 'center',
    // marginBottom: 20,
    flexDirection: 'row',
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: white,
    margin: 5,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor:cyan,
  },
  enteredDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: cyan,
    elevation: 5,
    fontSize: 20,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 30,
    paddingLeft: 15,
  },
  keyButton: {
    width: 60,
    height: 60,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: white,
    elevation: 3,
    //     borderWidth: 2,
    //   borderColor:green
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 10
  },
  txt: {
    fontSize: 20,
    fontWeight: '500',
    // color: black,
    paddingVertical: 10,
  },
});
