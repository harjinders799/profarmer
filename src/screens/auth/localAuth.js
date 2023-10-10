import {
  AppState,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import Profile from '../../container/profile';
import {useAuth} from '../../context/authContext';
import {HEIGHT, WIDTH} from '../../utils/constant';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import React, {useEffect, useState} from 'react';
import {goBack, navigate} from '../../navigation/ref';
import Logo from '../../container/logo';
import {logoFull, logoTag} from '../../utils/images';
import Button from 'src/components/button';
import {gray4, blue, black, gray6, green, cyan, white} from '../../utils/color';

import {primary, background} from '../../utils/themes';
import {strings} from '../../translations/locale';
const rnBiometrics = new ReactNativeBiometrics();

export default function LocalAuth() {
  const {user, pin, activeMidIndex, setUserVerified} = useAuth();
  const [isSensorAvailable, setIsSensorAvailable] = useState(false);
  const [biometricData, setBiometricData] = useState({});
  const [maxAttempt, setMaxAttempt] = useState(3);

  useEffect(() => {
    if (pin) checkSensor();
  }, []);
  console.log(pin, '---');
  const checkSensor = () => {
    rnBiometrics.isSensorAvailable().then(resultObject => {
      console.log(resultObject, '--------rewsult ');
      const {available, biometryType} = resultObject;
      setIsSensorAvailable(available);
      setBiometricData(resultObject);
      if (available) scanFinger();
      console.log(biometryType, 'biometry type ', available);
      if (available && biometryType === BiometryTypes.Biometrics) {
        console.log('Biometrics is supported');
      } else {
        console.log('Biometrics not supported');
      }
    });
  };
  const scanFinger = () => {
    rnBiometrics
      .simplePrompt({promptMessage: 'Confirm fingerprint'})
      .then(resultObject => {
        const {success, error} = resultObject;
        console.log(error, '------error biometric', success, maxAttempt);
        if (success) {
          setUserVerified();
          // replace('Dashboard');
          return;
        }
        if (error == 'User cancellation') {
          setMaxAttempt(0);
          return;
        }
        if (error != 'User cancellation' && error && error.trim() != '') {
          setMaxAttempt(maxAttempt - 1);
          AppState.currentState == 'active' && scanFinger();
          return;
        }
      })
      .catch(() => {
        console.log('biometrics failed');
        navigate('PinSecurity');
      });
  };
  if (maxAttempt == 0) navigate('PinSecurity');
  return (
    <BaseView>
      <Logo
        img={logoTag}
        style={[styles.logoHeader, {marginTop: HEIGHT <= 760 ? '15%' : '20%'}]}
      />
      <Text> {user?.name}</Text>
      <Button
        icon={'finger-print'}
        iconType="Ionicons"
        iconColor={gray6}
        label={
          !pin
            ? strings.setup_pin
            : `Login with ${
                biometricData?.available ? biometricData?.biometryType : 'Pin'
              }`
        }
        btnStyle={styles.finger}
        txtStyle={{color: gray6}}
        onPress={() => {
          !pin
            ? navigate('PinSecurity')
            : biometricData?.available
            ? scanFinger()
            : navigate('PinSecurity');
        }}
      />
    </BaseView>
  );
}

const styles = StyleSheet.create({
  box: {
    width: WIDTH / 2,
    height: WIDTH / 2,
    backgroundColor: primary,
    borderRadius: 222,
    marginVertical: 10,
  },
  text: {
    fontSize: 100,
  },
  logoHeader: {
    resizeMode: 'contain',
    width: '70%',
  },
  logo: {
    height: 30,
    width: 100,
    alignSelf: 'flex-start',
    margin: 0,
  },
  finger: {
    borderWidth: 3,
    elevation: 5,
    width: '80%',
    backgroundColor: white,
    borderColor: cyan,
    marginTop: 80,
  },
  terms: {
    position: 'absolute',
    bottom: 50,
    paddingHorizontal: 20,
  },
});
