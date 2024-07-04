import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
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
import { currentStamp } from '@utils/dateformat';

export default function AddLoan() {
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

  const onChangeValue = useCallback((key, value, isNumberOnly = false) => {
    setData(prevData => ({
      ...prevData,
      [key]: isNumberOnly
        ? value.replace(/[^0-9.]/g, '').replace(/(\..*?)\./g, '$1')
        : value,
    }));
  }, []);

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
      <ScrollView style={styles.form} keyboardShouldPersistTaps="always">
        <Input
          label={strings.name}
          autoFocus
          placeholder={strings.name}
          value={name}
          setValue={value => onChangeValue('name', value)}
        />
        <Input
          label={strings.phone}
          placeholder={strings.phone}
          value={phone}
          maxLength={10}
          setValue={value => onChangeValue('phone', value, true)}
          keyboardType="numeric"
        />
        <Input
          label={strings.interest}
          placeholder={strings.interest_rate}
          value={interest_rate}
          setValue={value => onChangeValue('interest_rate', value, true)}
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
