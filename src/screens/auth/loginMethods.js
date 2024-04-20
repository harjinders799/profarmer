import React, { useEffect } from 'react';
import {
  ScrollView,
  Image,
  StyleSheet,
  BackHandler,
  Alert,
  View,
} from 'react-native';
import BaseView from 'src/container/base';
import { WIDTH } from 'src/utils/constant';
import Input from 'src/components/input';
import Button from 'src/components/button';
import auth from '@react-native-firebase/auth';
import Logo from 'src/container/logo';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
import { useIsFocused, useRoute, useTheme } from '@react-navigation/native';
import { SignInUser } from 'src/network/auth-service';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import LanguagePicker from 'src/components/languagePicker';
import { strings } from 'src/translations/locale';
import { useLang } from 'src/context/langContext';
import OtpInputs from 'react-native-otp-inputs';
import Icon from 'src/components/icon';
import { replace } from 'src/navigation/ref';

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
import { blue } from 'src/utils/color';
import { navigate } from '../../navigation/ref';
import { createCottonPriceTable, createPickerExpenseTable, createPickerTable } from '../../sql';
import { useCotton } from '../../context/cottonContext';

GoogleSignin.configure({
  webClientId:
    '416058833468-5rn56d49jdg3ar3e0mp2o4e5nio1o65g.apps.googleusercontent.com',
});
const LoginMethods = ({ navigation }) => {
  const { colors } = useTheme();
  const { lang } = useLang();
  const { db } = useCotton()
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    (async () => {
      await createPickerTable(db);
      await createPickerExpenseTable(db);
      await createCottonPriceTable(db);
    })
  }, [isFocused])

  const signInG = async () => {
    try {
      setLoading(true)
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      auth().signInWithCredential(googleCredential);
      // replace('Main');
      // this.setState({ userInfo });
      setLoading(false)
    } catch (error) {
      setLoading(false)
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
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    await auth()
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
            let provider = await auth().fetchSignInMethodsForEmail(email);
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
        contentContainerStyle={{ alignItems: 'center' }}
        keyboardShouldPersistTaps="handled">
        <Logo />
        <Text h2>{strings.welcome}</Text>
        {/* <Input
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
                +91123
              </Text>
            </View>
          }
          placeholder={strings.phone}
          value={state.phone}
          inputStyle={{width: '70%'}}
          setValue={text => setState({...state, phone: text})}
        /> */}
        {/* {confirm ? (
          <OtpInputs
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
        )} */}
        <Button
          label="Sign-In With Email"
          iconName="email"
          iconType="Fontisto"
          iconColor={colors.background}
          btnStyle={{ backgroundColor: '#00bfff' }}
          onPress={() =>
            navigate('SignInWithEmail')}

        />
        <Button
          label="Sign-In With Phone"
          iconName="screen-smartphone"
          iconType="SimpleLineIcons"
          iconColor={colors.background}
          btnStyle={{ backgroundColor: '#a020f0' }}
          onPress={() =>
            navigate('Login')}
        />
        <Button
          label="Sign-In With Google"
          iconName="google"
          iconColor={colors.background}
          btnStyle={{ backgroundColor: '#db4437' }}
          onPress={signInG}
        />
        {/* <Button
          label="Sign-In With FaceBook"
          iconName="facebook"
          iconType="FontAwesome"
          iconColor={colors.background}
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
export default LoginMethods;
