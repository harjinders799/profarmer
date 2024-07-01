import React, { Component, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Text from 'src/components/text';
import { strings } from 'src/translations/locale';
import { black, cyan, green, red, white } from '../../utils/colors';
import { useAuth } from '../../context/authContext';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import BaseView from '../../container/base';
import { WIDTH } from '../../utils/constants';


export default function PinSecurity({ navigation }) {
  const { getPin, pin, reset, setUserVerified, setPin } = useAuth();
  const [enteredPin, setEnteredPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [verifiedPin, setVerifiedPin] = useState('');
  const [label, setLabel] = useState(pin ? 'Verify' : 'Enter');
  const [attempt, setAttempt] = useState(3);

  useEffect(() => {
    if (label === 'Enter' && enteredPin.length === 4) {
      setLabel('Confirm');
      setConfirmPin('');
    }

    const timer = setTimeout(() => {
      if (label === 'Confirm' && confirmPin.length === 4) {
        if (enteredPin === confirmPin) {
          setPin(enteredPin);
          setUserVerified();
          // navigation.replace('AddForm');
        } else {
          ToastError('PIN does not match');
        }
      }
      if (verifiedPin.length === 4 && label === 'Verify') {
        if (verifiedPin === pin) {
          setUserVerified();
        } else {
          if (attempt <= 1) {
            ToastError('You have exceed max attempt');
            reset();
          } else {
            ToastError('Pin Not match');
            setVerifiedPin('')
          }
          setAttempt(attempt - 1);
        }
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [enteredPin, confirmPin, verifiedPin, label]);
  // console.log('--------------------------', attempt);

  const handleKeyPress = key => {
    if (label === 'Enter' && enteredPin.length < 4) {
      setEnteredPin(enteredPin + key);
    } else if (label === 'Confirm' && confirmPin.length < 4) {
      setConfirmPin(confirmPin + key);
      // setBackgroundColor('cyan');
    } else if (label === 'Verify' && verifiedPin.length < 4) {
      setVerifiedPin(verifiedPin + key);
      // setBackgroundColor('cyan');
    }
  };

  const handleBackspace = () => {
    if (label === 'Enter' && enteredPin.length > 0) {
      setEnteredPin(enteredPin.slice(0, -1));
    } else if (label === 'Confirm' && confirmPin.length > 0) {
      setConfirmPin(confirmPin.slice(0, -1));
    } else if (label === 'Verify' && verifiedPin.length > 0) {
      setVerifiedPin(verifiedPin.slice(0, -1));
    }
  };
  if (attempt == 0) {
    reset();
  }
  return (
    <BaseView style={styles.container}>
      <Text h2 style={{ color: green }}>
        {label === 'Enter'
          ? strings.enter_pin
          : label === 'Confirm'
            ? strings.confirm_pin
            : strings.verify_pin}
      </Text>
      <View style={[styles.displayArea]}>
        {Array(4)
          .fill()
          .map((_, index) => (
            <View key={index} style={[styles.dot, { backgroundColor: white }]}>
              {(index < enteredPin.length && label == 'Enter') ||
                (index < confirmPin.length && label === 'Confirm') ||
                index < verifiedPin.length ? (
                <View style={[styles.enteredDot]} />
              ) : (
                ''
              )}
            </View>
          ))}
      </View>
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'X'].map(key => (
          <TouchableOpacity
            key={key}
            disabled={key === '' ? true : false}
            style={[styles.keyButton, { elevation: key === '' ? 0 : 3 }]}
            onPress={() =>
              key === 'X' ? handleBackspace() : handleKeyPress(key)
            }>
            <Text h2 style={{ color: green }}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: green,
  },
  enteredDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: green,
    elevation: 5,
    fontSize: 20,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginVertical: 20
  },
  keyButton: {
    width: WIDTH / 6,
    height: WIDTH / 6,
    margin: WIDTH / 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
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
