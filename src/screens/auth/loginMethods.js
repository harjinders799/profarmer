import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BaseView from 'src/container/base';
import { isIOS, WIDTH } from 'src/utils/constants';
import Button from 'src/components/button';
import auth from '@react-native-firebase/auth';
import Logo from 'src/container/logo';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
import { useIsFocused, useRoute, useTheme } from '@react-navigation/native';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import LanguagePicker from 'src/components/languagePicker';
import { strings } from 'src/translations/locale';
import { useLang } from 'src/context/langContext';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { navigate } from '../../navigation/ref';
import { orange } from '@utils/colors';

GoogleSignin.configure({
  webClientId:
    '416058833468-5rn56d49jdg3ar3e0mp2o4e5nio1o65g.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email', // Request email
    'https://www.googleapis.com/auth/userinfo.profile', // Request basic profile info
    'https://www.googleapis.com/auth/user.phonenumbers.read', // Request basic phone info
  ],
});
const LoginMethods = ({ navigation }) => {
  const { colors } = useTheme();
  const { lang } = useLang();
  const [loading, setLoading] = React.useState(false);

  const signInG = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      auth().signInWithCredential(googleCredential);
    } catch (error) {
      setLoading(false);
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        ToastError(error?.message);
      }
    }
  };
  return (
    <BaseView>
      <Loader visible={loading} />
      <LanguagePicker
        btnStyle={{
          borderRadius: 0,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          maxWidth: '40%',
          height: 40,
        }}
      />
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{
          alignItems: 'center',
          width: '90%',
          margin: '5%',
        }}
        keyboardShouldPersistTaps="handled">
        <Logo />
        <Text h2 style={{ marginBottom: 30 }}>
          {strings.welcome}
        </Text>
        <Button
          label="Sign-In With Email"
          iconName="email"
          iconType="Fontisto"
          iconColor={colors.background}
          btnStyle={{ backgroundColor: orange }}
          onPress={() => navigate('SignInWithEmail')}
        />
        {__DEV__ ? (
          <Button
            label="Sign-In With Phone"
            iconName="screen-smartphone"
            iconType="SimpleLineIcons"
            iconColor={colors.background}
            btnStyle={{ backgroundColor: '#34A853' }}
            onPress={() => navigate('Login')}
          />
        ) : null}
        <Button
          label="Sign-In With Google"
          iconName="google"
          iconColor={colors.background}
          btnStyle={{ backgroundColor: '#4285F4' }}
          onPress={signInG}
        />
        <Text center h4 onPress={() => navigate('ContactUs')}>
          {strings.needHelp}
        </Text>
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
