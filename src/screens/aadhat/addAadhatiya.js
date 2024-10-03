import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Button from '@components/button';
import Input from '@components/input';
import { currentStamp } from '@utils/dateformat';
import Loader from '@components/loader';
import BaseView from '@container/base';
import { ToastError, ToastSuccess } from '@utils/toast';
import { strings } from '@translations/locale';
import { useStore } from '@context/context';
import { goBack } from '@navigation/ref';
import { updateIneterstAmt } from '@network/interest-service';
import Header from '@components/header';
import { currencyInput } from '@utils/dateformat';
import { FadeInDown } from 'react-native-reanimated';
import { formatPhoneNumber, onChangeValue } from '@utils/helper';
import { addAadhatiya } from '@network/aadhat-service';

export default function AddAadhatiya() {
  const {
    setInterstRate,
    interest_rate: storeRate,
  } = useStore();
  const { params } = useRoute();
  const editData = params?.data ?? {};

  const [data, setData] = useState({
    name: editData?.name ?? '',
    phone: editData?.phone ?? '',
    interest_rate: editData?.interest_rate ?? storeRate ?? '',
  });
  const [loading, setLoading] = useState(false);
  const { name, phone, interest_rate } = data;

  const validateInputs = useCallback(() => {
    if (name === '') return ToastError(strings.name, strings.aadhtiya);
    if (phone.trim() === '' || parseInt(phone) <= 0) return ToastError(strings.phone, strings.aadhtiya);
    if (interest_rate.trim() === '' || parseInt(interest_rate) <= 0) return ToastError(strings.interest_rate, strings.aadhtiya);
    return true;
  }, [name, phone, interest_rate]);

  const handleResponse = useCallback(async (operation) => {
    setLoading(true);
    try {
      const response = await operation();
      setInterstRate(data.interest_rate);
      ToastSuccess(strings.amount_added, strings.amount);
      goBack();
      return response;
    } catch (error) {
      ToastError(error?.message, strings.aadhtiya);
    } finally {
      setLoading(false);
    }
  }, [data.interest_rate]);

  const onPress = useCallback(() => {
    const validation = validateInputs();
    if (validation !== true) return;

    const operation = editData.id
      ? () => updateIneterstAmt({ ...data, date: currentStamp() })
      : () => addAadhatiya({ ...data, name: name.trim(), phone: formatPhoneNumber(phone) });

    handleResponse(operation);
  }, [data, editData, validateInputs, handleResponse]);

  return (
    <BaseView space>
      <Loader visible={loading} />
      <Header back label={strings.aadhtiya} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>

        <Input
          entering={FadeInDown.delay(300)}
          label={strings.name}
          placeholder={strings.name}
          value={name}
          setValue={value => onChangeValue({ setData, key: 'name', value })}
        />

        <Input
          entering={FadeInDown.delay(350)}
          label={strings.phone}
          placeholder={'99xxxxxx99'}
          value={phone.replace('+91', '')}
          maxLength={10}
          keyboardType="number-pad"
          setValue={value => onChangeValue({ setData, key: 'phone', value, isPhone: true })}
        />

        <Input
          entering={FadeInDown.delay(400)}
          label={strings.interest}
          placeholder={strings.interest_rate}
          value={currencyInput(interest_rate)}
          keyboardType="number-pad"
          setValue={value => onChangeValue({ setData, key: 'interest_rate', value, isAmount: true })}
        />

        <Button
          entering={FadeInDown.delay(500)}
          label={strings.save}
          onPress={onPress}
        />
      </ScrollView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  type: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  date: {
    borderWidth: 1,
    height: 50,
    width: '100%',
    borderRadius: 10,
    marginVertical: 5,
    marginBottom: 30,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  form: {
    paddingVertical: 15,
    width: '100%',
    marginVertical: 10,
  },
});
