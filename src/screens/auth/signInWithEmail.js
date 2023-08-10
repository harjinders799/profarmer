import React from 'react';
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
import auth from '@react-native-firebase/auth';
import Logo from 'src/container/logo';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
import {useRoute, useTheme} from '@react-navigation/native';
import {SignInUser} from 'src/network/auth-service';
import {ToastError, ToastSuccess} from 'src/utils/toast';
import LanguagePicker from 'src/components/languagePicker';
import {strings} from 'src/translations/locale';
import {useLang} from 'src/context/langContext';
import Icon from 'src/components/icon';
import {replace} from 'src/navigation/ref';
import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
import {SignInWithEmailUser, SignUpUser} from '../../network/auth-service';

const SignInWithEmail = ({navigation}) => {
  const {colors} = useTheme();
  const {lang} = useLang();
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = React.useState({
    email: __DEV__ ? 'aaabbb@gmg.com' : '',
    password: __DEV__ ? '123456' : '',
  });
  //   const email = 'example@example.com';
  // const isValid = validateEmail(state.email);
  // console.log(isValid); // true

  const signIn = async () => {
    // if (state.email.length != 10) {
    //   ToastError('Please fill valid email Number', 'SignInWithEmail');
    //   return;
    // }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(state.email)) {
      ToastError('Please fill valid email', 'SignInWithEmail');
      return;
    }
   if (state.password.length < 6) {
    ToastError('Password must be at least 6 characters long', 'SignInWithEmail');
    return;
    };
    
    try {
      setLoading(true);
      SignInWithEmailUser(state.email, state.password)
        .then(data => {
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          ToastError(error?.message, 'SignInWithEmail');
        });
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, 'SignInWithEmail');
    }
  };

  return (
    <BaseView>
      <Loader visible={loading} />
      <ScrollView
        contentContainerStyle={{alignItems: 'center'}}
        keyboardShouldPersistTaps="handled">
        <Logo />
        <Text h2>{strings.welcome}</Text>
        <Input
          emailType
          iconName="email"
          iconType="Zocial"
          placeholder={strings.email}
          value={state.email}
          inputStyle={{}}
          setValue={text => setState({...state, email: text})}
        />
        <Input
          numberType
          iconName="locked"
          iconType="Fontisto"
          placeholder={strings.password}
          value={state.password}
          inputStyle={{}}
          setValue={text => setState({...state, password: text})}
        />
        <Button label="Login or Sign Up" onPress={signIn} />
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
export default SignInWithEmail;
