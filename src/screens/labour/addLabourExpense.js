import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from '@components/button';
import Input from '@components/input';
import DateTimePick from '@components/DateTime';
import { currentStamp, dateFormat } from '@utils/dateformat';
import Loader from '@components/loader';
import BaseView from '@container/base';
import { ToastError, ToastSuccess } from '@utils/toast';
import { strings } from '@translations/locale';
import { goBack } from '@navigation/ref';
import {
  deleteLabourExpense,
  submitLabourExpense,
  updateLabourExpense,
} from '@network/labour-service';
import Header from '@components/header';
import { currencyInput } from '@utils/dateformat';
import { FadeInDown } from 'react-native-reanimated';
import { onChangeValue } from '@utils/helper';

export default function AddLabourExpense() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const labourData = params?.data ?? {};
  const editData = params?.item ?? {};

  const [data, setData] = React.useState({
    detail: editData?.detail ?? '',
    amount: editData?.amount ?? '',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });

  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { detail, amount, date } = data;


  // Handle form submission
  const handleSubmit = React.useCallback(async () => {
    if (editData.date && editData?.amount && editData?.cid) {
      updateData();
    } else {
      addNewData();
    }
  }, [editData, data, labourData]);

  // Update existing data
  const updateData = React.useCallback(async () => {
    if (amount.trim() === '' || amount < 0) {
      return ToastError(strings.given_amount_to_labour);
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
      ToastSuccess(strings.successfully_saved);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
    }
  }, [data, editData, labourData, amount, date]);

  // Add new data
  const addNewData = React.useCallback(async () => {
    if (amount.trim() === '' || amount <= 0) {
      return ToastError(strings.given_amount_to_labour);
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
      ToastSuccess(strings.successfully_saved);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
    }
  }, [data, labourData, amount, date]);

  // Delete existing data
  const handleDelete = React.useCallback(async () => {
    try {
      setLoading(true);
      await deleteLabourExpense(editData, labourData);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
    }
  }, [editData]);

  return (
    <BaseView style={styles.container}>
      <Loader visible={loading} />
      <Header back label={labourData?.name} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.form}>
          <Input
            entering={FadeInDown.delay(300)}
            label={strings.given_amount_to_labour}
            autoFocus
            placeholder={strings.given_amount_to_labour}
            value={currencyInput(amount)}
            keyboardType="number-pad"
            setValue={value => onChangeValue({ setData, key: 'amount', value, isAmount: true })}
          />
          <Input
            entering={FadeInDown.delay(400)}
            label={strings.remark}
            placeholder={strings.remark}
            multiline
            autoCapitalize="words"
            value={detail}
            setValue={value => onChangeValue({ setData, key: 'detail', value })}
          />
          <Pressable
            onPress={() => {
              setShowDate(true);
              Keyboard.dismiss();
            }}
          >
            <Input
              entering={FadeInDown.delay(500)}
              label={strings.date}
              editable={false}
              placeholder={strings.date}
              value={dateFormat(date)}
              onPress={() => {
                setShowDate(true);
                Keyboard.dismiss();
              }}
            />
          </Pressable>
          <DateTimePick
            show={showDate}
            setShow={setShowDate}
            date={date}
            setDate={value => onChangeValue({ setData, key: 'date', value })}
          />
          <Button
            entering={FadeInDown.delay(600)}
            label={strings.save}
            onPress={handleSubmit}
          />
          <Button
            entering={FadeInDown.delay(700)}
            label={strings.delete}
            btnStyle={{
              backgroundColor: colors.error,
              display: editData?.cid && editData?.id ? 'flex' : 'none',
            }}
            onPress={handleDelete}
          />
        </View>
      </TouchableWithoutFeedback>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingVertical: 25,
    width: '100%',
    paddingHorizontal: 20,
  },
});
