import { AppState, StyleSheet } from 'react-native';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { useAuth } from '../../context/authContext';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import React, { useEffect, useState } from 'react';
import { navigate } from '../../navigation/ref';
import Logo from '../../container/logo';
import { logoTag } from '../../utils/images';
import Button from 'src/components/button';
import { gray6, green, white, orange } from '../../utils/colors';
import { strings } from '../../translations/locale';
const rnBiometrics = new ReactNativeBiometrics();

export default function LocalAuth() {
  const { user, pin, setUserVerified } = useAuth();
  const [biometricData, setBiometricData] = useState({});
  const [maxAttempt, setMaxAttempt] = useState(3);

  useEffect(() => {
    if (pin) checkSensor();
  }, [pin]);

  const checkSensor = () => {
    rnBiometrics.isSensorAvailable().then(resultObject => {
      console.log(resultObject, '--------rewsult ');
      const { available, biometryType } = resultObject;
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
      .simplePrompt({ promptMessage: 'Confirm fingerprint' })
      .then(resultObject => {
        const { success, error } = resultObject;
        console.log(error, '------error biometric', success, maxAttempt);
        if (success) {
          setUserVerified();
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
    <BaseView space>
      <Text h3 center style={{ marginVertical: 20 }}>
        {strings.security}
      </Text>

      <Logo img={logoTag} style={[styles.logoHeader]} />
      <Text h3 style={{ marginBottom: 50 }}> {user?.name}</Text>
      <Button
        iconLeft={'finger-print'}
        iconType="Ionicons"
        label={
          !pin
            ? strings.setup_pin
            : `Login with ${biometricData?.available ? biometricData?.biometryType : 'Pin'
            }`
        }
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
  logoHeader: {
    resizeMode: 'contain',
    width: '70%',
    height: 200,
    marginTop: 20,
  },
  finger: {
  },
});
