import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
import Input from '@components/input';
import { common } from '@utils/style';
import { SignInWithEmailUser } from '@network/auth-service';

GoogleSignin.configure({
  webClientId:
    '416058833468-5rn56d49jdg3ar3e0mp2o4e5nio1o65g.apps.googleusercontent.com',
  iosClientId:
    '416058833468-u3tduh7p714tu0v7iu4i3tstkoqbcee6.apps.googleusercontent.com',
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
  const [showBtns, setShowBtns] = useState(false);
  const [email, setEmail] = useState(__DEV__ ? 'test@tes.com' : '');
  const [password, setPassword] = useState(__DEV__ ? '123456' : '');

  const signIn = async () => {
    setLoading(true);
    try {
      await SignInWithEmailUser(email, password);
      // Handle successful sign-in (e.g., redirect or show success message)
    } catch (error) {
      ToastError(error?.message);
    } finally {
      setLoading(false);
    }
  };

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
          paddingBottom: 150,
        }}
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode='interactive'
        keyboardShouldPersistTaps="handled">
        <Pressable
          delayLongPress={showBtns ? 500 : 5000}
          onLongPress={() => setShowBtns(!showBtns)}>
          <Logo />
        </Pressable>
        {/* <Text h2 style={{ marginBottom: 30 }}>
          {strings.welcome}
        </Text>
        <Button
          label="Sign-In With Email"
          iconName="email"
          iconType="Fontisto"
          iconColor={colors.background}
          btnStyle={{ backgroundColor: orange }}
          onPress={() => navigate('SignInWithEmail')}
        /> */}
        <Text h2 style={{ marginBottom: 20 }}>
          {strings.welcome}
        </Text>
        <Input
          emailType
          iconName="email"
          iconType="Zocial"
          placeholder={strings.email}
          value={email}
          setValue={setEmail}
        />
        <Input
          iconName="locked"
          iconType="Fontisto"
          placeholder={strings.password}
          value={password}
          setValue={setPassword}
        />
        <Button label={strings.login} onPress={signIn} />
        <Text onPress={() => navigate('SignUp')}>
          {strings["don't_have_account"]}
        </Text>
        <View style={showBtns ? common.row_btw : common.centerAligned}>
          {showBtns ? (
            <Button
              label="Sign-In With"
              iconRight="phone"
              iconType="Feather"
              iconColor={colors.background}
              btnStyle={{
                backgroundColor: '#34A853',
                maxWidth: '45%',
                height: 40,
              }}
              onPress={() => navigate('Login')}
            />
          ) : null}
          {(isIOS && showBtns) || !isIOS ? (
            <Button
              label="Sign-In With"
              iconRight="google"
              iconColor={colors.background}
              btnStyle={{
                backgroundColor: '#4285F4',
                maxWidth: '45%',
                height: 40,
              }}
              onPress={signInG}
            />
          ) : null}
        </View>
        <Text center onPress={() => navigate('ContactUs')}>
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
