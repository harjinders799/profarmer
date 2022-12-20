import React, {useEffect} from 'react';
import {
  ScrollView,
  Image,
  StyleSheet,
  BackHandler,
  Alert,
  View,
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

GoogleSignin.configure({
  webClientId:
    '416058833468-5rn56d49jdg3ar3e0mp2o4e5nio1o65g.apps.googleusercontent.com',
});
const Login = ({navigation}) => {
  const {colors} = useTheme();
  const {lang} = useLang();
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = React.useState({
    phone: __DEV__ ? '1231231231' : '',
  });
  const [confirm, setConfirm] = React.useState(null);

  // useEffect(() => {
  //     userAuth();
  // }, [lang]);

  // useEffect(() => {
  //     const backAction = () => {
  //         BackHandler.exitApp()
  //         return true;
  //     };
  //     const backHandler = BackHandler.addEventListener(
  //         "hardwareBackPress",
  //         backAction
  //     );
  //     return () => backHandler.remove();
  // }, [BackHandler]);

  // const userAuth = async () => {
  //     try {
  //         let id = Auth().currentUser?.uid;
  //         if (id) navigation.replace('Main');
  //         else return;
  //         setLoading(false);
  //     } catch (error) {
  //         setLoading(false);
  //         console.log(error)
  //     }
  // }

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
        })
        .catch(error => {
          setLoading(false);
          ToastError(error?.message, 'Login');
        });
    } catch (error) {
      setLoading(false);
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
  const signInG = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = Auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      Auth().signInWithCredential(googleCredential);
      // replace('Main');
      // this.setState({ userInfo });
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        ToastError(error?.message, 'Login');
      }
    }
  };

  const getFacebookEmail = () =>
    new Promise(resolve => {
      const infoRequest = new GraphRequest(
        '/me?fields=email',
        null,
        (error, result) => {
          if (error) {
            resolve(null);
            return;
          }

          resolve(result.email);
        },
      );
      new GraphRequestManager().addRequest(infoRequest).start();
    });

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      ToastError('Something went wrong obtaining access token', 'Login');
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = Auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    await Auth()
      .signInWithCredential(facebookCredential)
      .then(res => {
        ToastSuccess(`Yay! Success`, 'Login');
      })
      .catch(async error => {
        if (
          error.code &&
          error.code === 'auth/account-exists-with-different-credential'
        ) {
          const email = await getFacebookEmail();
          if (email) {
            let provider = await Auth().fetchSignInMethodsForEmail(email);
            if (provider[0] == 'google.com') {
              ToastError(
                `You have already used "${email}". Please continue with Google login.`,
                'Facebook',
              );
              signInG();
              return;
            }
            if (provider[0]) {
              signInG();
              ToastError(
                `You have already used "${email}". Please continue with Email and Password or Try with Google Login.`,
                'Facebook',
              );
            }
          }
        }
      });
    // replace('Main');
  }
  return (
    <BaseView>
      <Loader visible={loading} />
      <LanguagePicker />
      <ScrollView
        contentContainerStyle={{alignItems: 'center'}}
        keyboardShouldPersistTaps="handled">
        <Logo />
        <Text h2>{strings.welcome}</Text>
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
        <Button
          label="Google Sign-In"
          btnStyle={{backgroundColor: '#3b519f'}}
          onPress={signInG}
        />
        <Button
          label="FaceBook Sign-In"
          btnStyle={{backgroundColor: '#3b5998'}}
          onPress={onFacebookButtonPress}
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
