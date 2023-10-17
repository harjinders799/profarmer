import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Image,
  StyleSheet,
  BackHandler,
  Alert,
  View,
  PermissionsAndroid,
} from 'react-native';
import BaseView from 'src/container/base';
import { WIDTH } from 'src/utils/constant';
import Input from 'src/components/input';
import Button from 'src/components/button';
import { Auth } from 'src/service/setup';
import Logo from 'src/container/logo';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
import { useRoute, useTheme } from '@react-navigation/native';
import { SignInUser } from 'src/network/auth-service';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import { strings } from 'src/translations/locale';
import { useLang } from 'src/context/langContext';
import OtpInputs from 'react-native-otp-inputs';
import Icon from 'src/components/icon';
import { black, gray3, green } from '../../utils/color';

const Login = ({ navigation }) => {
  const { colors } = useTheme();
  const { setAuthenticate } = useLang();
  const [loading, setLoading] = React.useState(false);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [time, setTime] = useState(undefined);
  const [state, setState] = React.useState({
    phone: __DEV__ ? '1231231231' : '',
  });
  const [code, setCode] = useState();
  const [confirm, setConfirm] = React.useState(null);

  useEffect(() => {
    setAuthenticate(true);
    const timer = setTimeout(() => {
      if (time > 0) setTime(prev => prev - 1);
      // if (time == -1) setCanResendOtp(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [canResendOtp, time]);
  // console.log(time, time > 0);
  // useEffect(() => {
  // try {
  //   getOtp()
  //     .then(p =>
  //       startOtpListener(message => {
  //         console.log(message, '-------message');
  //         if (message) {
  //           const otp = /(\d{6})/g.exec(message)[1];
  //           handleOtp(otp);
  //         }
  //       }),
  //     )
  //     .catch(p => console.log(p));
  // } catch (error) {
  //   console.log(error, '----');
  // }
  // return () => removeListener();
  // }, []);
  // const getPermissions = async () => {
  //   let granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE, PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS]);
  //   if (granted == PermissionsAndroid.RESULTS.GRANTED) {
  //     let phoneNumber = await deviceInfo.getPhoneNumber();
  //     console.log(phoneNumber, '--------');
  //   }
  // };

  const signIn = async () => {
    if (state.phone.length != 10) {
      ToastError('Please fill valid Phone Number', 'Login');
      return;
    }
    try {
      setLoading(true);
      SignInUser(state.phone)
        .then(data => {
          setConfirm(data);
          setLoading(false);
          setTime(30);
          setCanResendOtp(false);
        })
        .catch(error => {
          setLoading(false);
          ToastError(error?.message, 'Login');
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
      ToastError(error?.message, 'Login');
    }
  };

  const handleOtp = otp => {
    let otpCode = !isNaN(otp) ? otp : code;
    setCode(otpCode);
    if (otpCode.length == 6) {
      try {
        setLoading(true);
        // await confirm.confirm(otpCode);
        const phoneCredentials = Auth.PhoneAuthProvider.credential(
          confirm.verificationId,
          otpCode,
        );
        // Try to sign in with the phone credentials
        Auth()
          .signInWithCredential(phoneCredentials)
          .then(userCredentials => {
            setLoading(false);
            // replace('Main');
            ToastSuccess('Successfully Logged In!', 'OTP');
          })
          .catch(error => {
            setLoading(false);
            ToastError(error?.message, 'OTP');
          });
      } catch (error) {
        setLoading(false);
        ToastError(error?.message, 'OTP');
      }
    }
  };

  return (
    <BaseView>
      <Loader visible={loading} />
      {/* <LanguagePicker /> */}
      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        keyboardShouldPersistTaps="handled">
        <Logo />
        <Text h2 style={{ marginBottom: 50 }}>
          {strings.welcome}
        </Text>
        <Input
          numberType
          autoFocus
          maxLength={10}
          textContentType='telephoneNumber'
          dataDetectorTypes={'phoneNumber'}
          leftComponent={
            <View style={styles.row}>
              <Icon
                name="phone"
                type="Feather"
                color={colors.primary}
                size={20}
              />
              <Text h3 pl={10}>
                +91
              </Text>
            </View>
          }
          placeholder={strings.phone}
          value={state.phone}
          inputStyle={{ width: '70%' }}
          setValue={text => setState({ ...state, phone: text })}
        />
        {confirm ? (
          <OtpInputs
            autoFocus
            autofillFromClipboard
            autofillListenerIntervalMS={3000}
            handleChange={handleOtp}
            numberOfInputs={6}
            style={styles.otp}
            inputContainerStyles={[styles.cell, { borderColor: gray3 }]}
            inputStyles={[styles.cellTxt, { color: black }]}
            textBreakStrategy="highQuality"
          />
        ) : (
          <Button label={strings.login} onPress={signIn} />
        )}
        <Button
          label={'Verify'}
          disabled={code ? code.length != 6 : true}
          btnStyle={{ display: confirm ? 'flex' : 'none', marginTop: -20 }}
          onPress={handleOtp}
        />
        <Text>
          {time >= 30 || time <= 0 || time == undefined ? '' : `00:${time}`}
        </Text>
        <Button
          label={strings.resend_otp}
          disabled={time > 0 || time == undefined}
          btnStyle={[
            styles.btn,
            {
              opacity: time > 0 || time == undefined ? 0.7 : 1,
              backgroundColor: time > 0 || time == undefined ? gray3 : green,
            },
          ]}
        // onPress={signIn}
        />
      </ScrollView>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  img: {
    height: 200,
    width: WIDTH,
    marginTop: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRightWidth: 1,
  },
  otp: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 50,
  },
  cell: {
    borderWidth: 1,
    borderRadius: 10,
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
export default Login;
