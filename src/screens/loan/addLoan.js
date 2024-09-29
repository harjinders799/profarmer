import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from '@components/button';
import Input from '@components/input';
import Text from '@components/text';
import BaseView from '@container/base';
import { goBack } from '@navigation/ref';
import { strings } from '@translations/locale';
import Header from '@components/header';
import Loader from '@components/loader';
import { ToastError, ToastSuccess } from '@utils/toast';
import { submitLoan, updateLoanName } from '@network/loan-service';
import { currencyInput } from '@utils/dateformat';
import { onChangeValue } from '@utils/helper';
import { getUserByPhone } from '@network/auth-service';
import auth from '@react-native-firebase/auth';
import Icon from '@components/icon';
import Animated from 'react-native-reanimated';
import { common } from '@utils/style';

export default function AddLoan() {
  const user = auth().currentUser;
  const { colors } = useTheme();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const [data, setData] = React.useState({
    name: editData?.name ?? '',
    phone: editData?.phone ?? '',
    interest_rate: editData?.interest_rate ?? '',
  });
  const [loading, setLoading] = React.useState(false);
  const { name, phone, interest_rate } = data;
  const [verifiedUser, setVerifiedUser] = useState({});
  const [checking, setChecking] = useState(false);

  const onPress = useCallback(() => {
    if (editData?.name) {
      updateData();
    } else {
      addNew();
    }
  }, [name, phone, interest_rate]);

  const updateData = async () => {
    if (!name || name.trim() == '') {
      ToastError(strings.receiver_name);
    } else if (interest_rate.trim() == '' || parseInt(interest_rate) <= 0) {
      ToastError(strings.interest_rate);
    } else {
      setLoading(true);
      await updateLoanName(editData?.name, { ...data, name: name.trim() });
      setLoading(false);
      ToastSuccess(strings.update);
      goBack();
    }
  };

  const addNew = useCallback(async () => {
    if (!name || name.trim() == '') {
      return ToastError(strings.name, strings.loan);
    }
    if (interest_rate.trim() == '' || parseInt(interest_rate) <= 0) {
      return ToastError(strings.interest_rate, strings.loan);
    }
    try {
      setLoading(true);
      await submitLoan({ ...data, name: name.trim() });
      setLoading(false);
      ToastSuccess(strings.receiver_added);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.loan);
    }
  }, [name, phone, interest_rate]);

  return (
    <BaseView space>
      <Loader visible={loading} />
      <Header back label={editData?.name ? strings.update : strings.add_loan} />
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }} automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="always">
        <Input
          label={strings.name}
          autoFocus
          placeholder={strings.name}
          value={name}
          setValue={value =>
            onChangeValue({ setData, key: 'name', value, isName: true })
          }
        />
        <Input
          label={strings.phone}
          placeholder={strings.phone}
          value={phone}
          maxLength={10}
          setValue={value => {
            onChangeValue({ setData, key: 'phone', value, isPhone: true });
            setVerifiedUser(undefined);
          }}
          keyboardType="numeric"
          onBlur={async () => {
            try {
              setChecking(true);
              let res = await getUserByPhone(phone);
              if (user.uid == res?.id) ToastError("You can't add yourself");
              else setVerifiedUser(res);
              setChecking(false);
            } catch (error) {
              setChecking(false);
              console.log(error);
              ToastError(error?.messageHI);
            }
          }}
        />
        {verifiedUser?.id ? (
          <Animated.View
            style={[
              common.row_btw,
              {
                backgroundColor: colors.success,
                borderRadius: 8,
                padding: 5,
                paddingHorizontal: 10,
              },
            ]}>
            <Text color={colors.background}>
              {`User registered with name -`}
              <Text bold color={colors.background}>
                {` ${verifiedUser?.name}`}
              </Text>
            </Text>

            <Icon
              name={'user-check'}
              type="Feather"
              color={colors.background}
              size={15}
            />
          </Animated.View>
        ) : checking ? (
          <ActivityIndicator color={colors.text} />
        ) : verifiedUser == 'user not found' ? (
          <Text color={colors.error}>User not using this app yet</Text>
        ) : null}
        <Input
          label={strings.interest}
          placeholder={strings.interest_rate}
          value={currencyInput(interest_rate)}
          maxLength={10}
          setValue={value =>
            onChangeValue({
              setData,
              key: 'interest_rate',
              value,
              isAmount: true,
            })
          }
          keyboardType="numeric"
        />
        <Button label={strings.save} onPress={onPress} />
      </ScrollView>
    </BaseView>
  );
}
const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
});
