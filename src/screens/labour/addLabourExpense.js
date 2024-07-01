import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
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
import { navigate } from 'src/navigation/ref';
import { goBack } from 'src/navigation/ref';
import {
  deleteLabourExpense,
  submitLabourExpense,
  updateLabourExpense,
} from '../../network/labour-service';
import Header from '../../components/header';
import { currencyFormat, currencyInput } from '../../utils/dateformat';
import { FadeInDown } from 'react-native-reanimated';

export default function AddLabourExpense() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const labourData = params?.data ?? {};
  const editData = params?.item ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    detail: editData?.detail ?? '',
    amount: editData?.amount ?? '',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { detail, amount, date } = data;

  const onChangeValue = (key, value, isNumberOnly = false) => {
    setData({
      ...data,
      [key]: isNumberOnly ? value.replace(/[^0-9]/g, '') : value,
    });
  };

  const onPress = () => {
    if (editData.date && editData?.amount && editData?.cid) updateData();
    else AddNew();
  };
  const updateData = async () => {
    if (amount.trim() == '' || amount < 0) {
      return ToastError(strings.given_amount_to_labour, strings.labour);
    }
    try {
      setLoading(true);
      await updateLabourExpense({
        ...data,
        date: currentStamp(date),
        cid: labourData?.id,
        id: editData?.id,
        given_amount: (
          parseFloat(labourData?.given_amount) +
          (parseFloat(amount) - parseFloat(editData?.amount))
        ).toFixed(2),
      });
      setLoading(false);
      ToastSuccess(strings.labour_expense_added, strings.labour);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.labour);
    }
  };
  console.log(parseFloat(amount), amount)
  const AddNew = async () => {
    if (amount.trim() == '' || amount <= 0) {
      return ToastError(strings.given_amount_to_labour, strings.labour);
    }
    try {
      setLoading(true);
      await submitLabourExpense({
        ...data,
        given_amount: (
          parseFloat(labourData?.given_amount) + parseFloat(amount)
        ).toFixed(2),
        cid: labourData?.id,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.labour_expense_added, strings.labour);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.labour);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteLabourExpense(editData);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.labour);
    }
  };
  console.log({ labourData })
  console.log({ editData })

  return (
    <BaseView style={styles.container}>
      <Loader visible={loading} />
      <Header back label={labourData?.name} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.form}>
          <Input
            entering={FadeInDown.delay(300)}
            label={strings.given_amount_to_labour}
            refs={refAmt}
            autoFocus
            placeholder={strings.given_amount_to_labour}
            value={currencyInput(amount)}
            keyboardType="number-pad"
            setValue={value => onChangeValue('amount', value, true)}
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
            entering={FadeInDown.delay(600)}
            label={strings.save}
            onPress={onPress}
          />
          <Button
            entering={FadeInDown.delay(700)}
            label={strings.delete}
            btnStyle={{
              backgroundColor: colors.error,
              display: editData?.cid && editData?.id ? 'flex' : 'none',
            }}
            onPress={onDelete}
          />
        </View>
      </TouchableWithoutFeedback>
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
    paddingVertical: 25,
    width: '100%',
    paddingHorizontal: 20,
  },
});
