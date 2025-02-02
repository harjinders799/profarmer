import React, {useState} from 'react';
import BaseView from 'src/container/base';
import Input from 'src/components/input';
import Button from 'src/components/button';
import Logo from 'src/container/logo';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
import {ToastError, ToastSuccess} from 'src/utils/toast';
import {strings} from 'src/translations/locale';
import {resetPasswordWithCode} from '../../network/auth-service';
import {ScrollView, TouchableOpacity} from 'react-native';
import Header from '@components/header';
import {navigate, replace} from '@navigation/ref';

const ResetPassword = ({route}) => {
  const {oobCode} = route.params;
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      ToastError(strings.passwords_do_not_match);
      return;
    }
    setLoading(true);
    try {
      await resetPasswordWithCode(oobCode, password);
      ToastSuccess(strings.successfully_updated);
      replace('SignInWithEmail');
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
        style={{width: '100%'}}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 150,
        }}
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled">
        <Logo />
        <Text h2 style={{marginBottom: 20}}>
          {strings.reset_password}
        </Text>
        <Input
          iconName="locked"
          iconType="Fontisto"
          placeholder={strings.new_password}
          value={password}
          setValue={setPassword}
          secureTextEntry
        />
        <Input
          iconName="locked"
          iconType="Fontisto"
          placeholder={strings.confirm_password}
          value={confirmPassword}
          setValue={setConfirmPassword}
          secureTextEntry
        />
        <Button label={strings.reset_password} onPress={resetPassword} />
      </ScrollView>
    </BaseView>
  );
};

export default ResetPassword;
