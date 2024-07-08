import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from 'src/components/button';
import Input from 'src/components/input';
import { currentStamp, dateFormat } from 'src/utils/dateformat';
import { submitInterestAmount } from 'src/network/interest-service';
import Loader from 'src/components/loader';
import BaseView from 'src/container/base';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import { strings } from 'src/translations/locale';
import { useStore } from 'src/context/context';
import { goBack } from 'src/navigation/ref';
import { updateIneterstAmt } from 'src/network/interest-service';
import Header from '../../components/header';
import { currencyInput } from '../../utils/dateformat';
import { FadeInDown } from 'react-native-reanimated';
import { onChangeValue } from '@utils/helper';
import { addAadhatiya } from '@network/aadhat-service';

export default function AddAadhatiya() {
  const {
    setGivers,
    interest_rate: storeRate,
    setInterstRate,
    givers,
  } = useStore();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const [data, setData] = React.useState({
    name: editData?.name ?? '',
    phone: editData?.phone ?? '',
    interest_rate: editData?.interest_rate ?? storeRate ?? '',
  });
  const [loading, setLoading] = React.useState(false);
  const { name, phone, interest_rate } = data;

  const onPress = () => {
    if (editData.id) updateData();
    else AddNew();
  };
  const updateData = async () => {
    if (name == '') {
      return ToastError(strings.name, strings.aadhtiya);
    }
    if (phone.trim() == '' || parseInt(phone) <= 0) {
      return ToastError(strings.phone, strings.aadhtiya);
    }
    if (interest_rate.trim() == '' || parseInt(interest_rate) <= 0) {
      return ToastError(strings.interest_rate, strings.aadhtiya);
    }
    try {
      setLoading(true);
      let res = await updateIneterstAmt({
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      setInterstRate(interest_rate);
      ToastSuccess(strings.amount_added, strings.amount);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.aadhtiya);
    }
  };

  const AddNew = async () => {
    if (name == '') {
      return ToastError(strings.name, strings.aadhtiya);
    }
    if (phone.trim() == '' || parseInt(phone) <= 0) {
      return ToastError(strings.phone, strings.aadhtiya);
    }
    if (interest_rate.trim() == '' || parseInt(interest_rate) <= 0) {
      return ToastError(strings.interest_rate, strings.aadhtiya);
    }
    try {
      setLoading(true);
      await addAadhatiya({
        ...data,
        name: name.trim(),
      });
      setLoading(false);
      ToastSuccess(strings.aadhtiya, strings.aadhtiya);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.aadhtiya);
    }
  };

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
          value={phone}
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
          setValue={value =>
            onChangeValue({ setData, key: 'interest_rate', value, isAmount: true })
          }
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
