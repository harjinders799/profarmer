import React, {useEffect} from 'react';
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
import {WIDTH} from 'src/utils/constant';
import Input from 'src/components/input';
import Button from 'src/components/button';
import {Auth} from 'src/service/setup';
import Logo from 'src/container/logo';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
import {useRoute, useTheme} from '@react-navigation/native';
import {SignInUser} from 'src/network/auth-service';
import {ToastError, ToastSuccess} from 'src/utils/toast';
import LanguagePicker from 'src/components/languagePicker';
import {strings} from 'src/translations/locale';
import {useLang} from 'src/context/langContext';
import OtpInputs from 'react-native-otp-inputs';
import Icon from 'src/components/icon';
import {replace} from 'src/navigation/ref';

import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {blue} from 'src/utils/color';
import {
  getHash,
  getOtp,
  removeListener,
  startOtpListener,
  useOtpVerify,
} from 'react-native-otp-verify';
import deviceInfo from 'react-native-device-info';

GoogleSignin.configure({
  webClientId:
    '416058833468-5rn56d49jdg3ar3e0mp2o4e5nio1o65g.apps.googleusercontent.com',
});
const Login = ({navigation}) => {
  const {colors} = useTheme();
  const {setAuthenticate} = useLang();
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = React.useState({
    phone: __DEV__ ? '9928185712' : '',
  });
  const [confirm, setConfirm] = React.useState(null);

  useEffect(() => {
    setAuthenticate(true);
    try {
      getOtp()
        .then(p =>
          startOtpListener(message => {
            console.log(message);
            if (message) {
              const otp = /(\d{6})/g.exec(message)[1];
              handleOtp(otp);
            }
          }),
        )
        .catch(p => console.log(p));
    } catch (error) {
      console.log(error, '----');
    }
    return () => removeListener();
  }, []);

  const signIn = async () => {
    // PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS;
    // let phoneNumber = await deviceInfo.getPhoneNumber();
    // console.log(phoneNumber, '--------');

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
        })
        .catch(error => {
          setLoading(false);
          ToastError(error?.message, 'Login');
        });
    } catch (error) {
      setLoading(false);
      console.log(error)
      ToastError(error?.message, 'Login');
    }
  };

  const handleOtp = code => {
    if (code.length == 6) {
      try {
        setLoading(true);
        // await confirm.confirm(code);
        const phoneCredentials = Auth.PhoneAuthProvider.credential(
          confirm.verificationId,
          code,
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
        contentContainerStyle={{alignItems: 'center'}}
        keyboardShouldPersistTaps="handled">
        <Logo />
        <Text h2 style={{marginBottom: 50}}>
          {strings.welcome}
        </Text>
        <Input
          numberType
          maxLength={10}
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
          inputStyle={{width: '70%'}}
          setValue={text => setState({...state, phone: text})}
        />
        {confirm ? (
          <OtpInputs
            autoFocus
            autofillFromClipboard
            autofillListenerIntervalMS={3000}
            handleChange={handleOtp}
            numberOfInputs={6}
            style={styles.otp}
            inputContainerStyles={[styles.cell, {borderColor: colors.text}]}
            inputStyles={[styles.cellTxt, {color: colors.text}]}
            textBreakStrategy="highQuality"
          />
        ) : (
          <Button label={strings.login} onPress={signIn} />
        )}
        {/* <Button
          label="Google Sign-In"
          btnStyle={{ backgroundColor: '#3b519f' }}
          onPress={signInG}
        />
        <Button
          label="FaceBook Sign-In"
          btnStyle={{ backgroundColor: '#3b5998' }}
          onPress={onFacebookButtonPress}
        /> */}
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
