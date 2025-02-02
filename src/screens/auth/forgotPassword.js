import React, {useState} from 'react';
import BaseView from 'src/container/base';
import Input from 'src/components/input';
import Button from 'src/components/button';
import Logo from 'src/container/logo';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
import {ToastError, ToastSuccess} from 'src/utils/toast';
import {strings} from 'src/translations/locale';
import {sendPasswordResetEmail} from '../../network/auth-service';
import {ScrollView, TouchableOpacity} from 'react-native';
import Header from '@components/header';
import {goBack} from '@navigation/ref';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const resetPassword = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(email);
      ToastSuccess(strings.reset_link_sent);
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
          {strings.forgot_password}
        </Text>
        <Input
          emailType
          iconName="email"
          iconType="Zocial"
          placeholder={strings.email}
          value={email}
          setValue={setEmail}
        />
        <Button label={strings.reset_password} onPress={resetPassword} />
        <TouchableOpacity hitSlop={20} onPress={goBack}>
          <Text>{strings.back_to_login}</Text>
        </TouchableOpacity>
      </ScrollView>
    </BaseView>
  );
};

export default ForgotPassword;
