import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Keyboard,
  Pressable,
  View,
} from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from 'src/components/button';
import Input from 'src/components/input';
import DateTimePick from 'src/components/DateTime';
import { currentStamp, dateFormat } from 'src/utils/dateformat';
import Loader from 'src/components/loader';
import BaseView from 'src/container/base';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import { strings } from 'src/translations/locale';
import { goBack, navigate } from 'src/navigation/ref';
import Header from '../../components/header';
import { addLoanAmount, submitLoan, updateLoan, updateLoanTransaction } from '../../network/loan-service';
import { currencyInput } from '../../utils/dateformat';
import { FadeInDown } from 'react-native-reanimated';
import Checkbox from '@components/checkbox';
import { common } from '@utils/style';

export default function AddCredit() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const editItem = params?.item ?? {};
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    type: editItem?.type ?? editData?.type ?? 'giver',
    detail: editItem?.detail ?? '',
    amount: (editItem?.amount ?? '').toString(),
    date: editItem?.date ? new Date(parseInt(editItem?.date)) : new Date(),
  });
  const { type, amount, detail, date } = data;

  const onChangeValue = (key, value, isNumberOnly = false) => {
    setData({
      ...data,
      [key]: isNumberOnly ? value.replace(/[^0-9]/g, '') : value,
    });
  };
  const onPress = () => {
    if (editItem?.lid) updateData();
    else AddNew();
  };
  const updateData = async () => {
    try {
      if (amount.trim() == '' || amount < 0) {
        ToastError(strings.credit_amount);
      } else {
        setLoading(true);
        console.log(data)
        await updateLoanTransaction({
          ...data,
          lid: editData?.id,
          id: editItem?.id,
          date: currentStamp(date)
        });
        setLoading(false);
        ToastSuccess(strings.given_amount_added);
        navigate('Loan');
      }
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
      console.log(error, '----111---');
    }
  };
  const AddNew = async () => {
    try {
      if (amount.trim() == '' || amount <= 0) {
        return ToastError(strings.credit_amount);
      }
      setLoading(true);
      await addLoanAmount({
        lid: editData?.id,
        amount,
        detail,
        type,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.amount_added);
      navigate('Loan');
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
      console.log(error, '----11--');
    }
  };

  return (
    <BaseView space>
      <Loader visible={loading} />
      <Header back label={editData.name} />
      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        <View
          style={[common.centerAlignedJustify, { padding: 20, paddingTop: 0 }]}>
          <Checkbox
            isChecked={type == 'giver'}
            activeColor={colors.success}
            label={strings.gave_him + ' ' + editData.name}
            style={{ width: '50%', marginTop: 10 }}
            onPress={() => onChangeValue('type', 'giver')}
          />
          <Checkbox
            isChecked={type == 'receiver'}
            activeColor={colors.error}
            label={strings.received_from + ' ' + editData.name}
            style={{ width: '50%', marginTop: 10 }}
            onPress={() => onChangeValue('type', 'receiver')}
          />
        </View>
        <Input
          entering={FadeInDown.delay(300)}
          label={
            type == 'receiver' ? strings.taken_amount : strings.given_amount
          }
          placeholder={'Rs'}
          value={currencyInput(amount)}
          autoFocus
          setValue={value => onChangeValue('amount', value, true)}
          keyboardType="numeric"
        />
        <Input
          entering={FadeInDown.delay(400)}
          label={strings.remark}
          placeholder={strings.remark}
          multiline
          autoCapitalize="words"
          value={detail}
          setValue={value => onChangeValue('detail', value)}
        />
        <Pressable
          onPress={() => {
            setShowDate(true);
            Keyboard.dismiss();
          }}>
          <Input
            entering={FadeInDown.delay(500)}
            label={strings.date}
            editable={false}
            placeholder={strings.date}
            value={dateFormat(date)}
          />
        </Pressable>
        <DateTimePick
          show={showDate}
          setShow={setShowDate}
          date={date}
          setDate={data => onChangeValue('date', data)}
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
  container: {},
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
    width: '100%',
  },
});
