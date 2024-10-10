import React, { useState } from 'react';
import BaseView from 'src/container/base';
import Input from 'src/components/input';
import Button from 'src/components/button';
import Logo from 'src/container/logo';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
import { ToastError } from 'src/utils/toast';
import { strings } from 'src/translations/locale';
import { SignInWithEmailUser } from '../../network/auth-service';
import { navigate } from '@navigation/ref';
import { ScrollView, TouchableOpacity } from 'react-native';
import Header from '@components/header';

const SignInWithEmail = () => {
  const [loading, setLoading] = useState(false);
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

  return (
    <BaseView space>
      <Header back />
      <Loader visible={loading} />
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 150,
        }}
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode='interactive'
        keyboardShouldPersistTaps="handled">
        <Logo />
        <Text h2 style={{ marginBottom: 20 }}>{strings.welcome}</Text>
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
        <TouchableOpacity hitSlop={20} onPress={() => navigate('SignUp')}>
          <Text >{strings['don\'t_have_account']}</Text>
        </TouchableOpacity>
      </ScrollView>
    </BaseView>
  );
};

export default SignInWithEmail;
