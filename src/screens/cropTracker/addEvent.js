import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Keyboard } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from '@components/button';
import Input from '@components/input';
import Loader from '@components/loader';
import BaseView from '@container/base';
import { ToastError, ToastSuccess } from '@utils/toast';
import { strings } from '@translations/locale';
import { goBack } from '@navigation/ref';
import Header from '@components/header';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { onChangeValue } from '@utils/helper';
import { deleteEvent, submitEvent, updateEvent } from '@network/crop-service';
import DateTimePick from '@components/DateTime';
import { currencyInput, currentStamp, dateFormat } from '@utils/dateformat';
import Checkbox from '@components/checkbox';
import { common } from '@utils/style';
import Text from '@components/text';

export default function AddEvent() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const editItem = params?.item ?? {};

  const [data, setData] = useState({
    title: editItem?.title ?? '',
    description: editItem?.description ?? '',
    amount: editItem?.expense_amount ?? editItem?.earning_amount ?? '',
    date: editItem?.date ? new Date(editItem?.date) : new Date(),
  });

  const [isExpense, setIsExpense] = useState(() => {
    if (editItem?.expense_amount) return true;
    if (editItem?.earning_amount) return false;
    return undefined;
  });

  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const { title, description, amount, date } = data;

  const handleSubmit = useCallback(async () => {
    await handleEventSubmission(editItem?.id ? updateEvent : submitEvent);
  }, [data, editItem?.id]);

  const handleEventSubmission = async (eventFunction) => {
    setLoading(true);
    try {
      const newExpenseAmount = isExpense ? data.amount : 0;
      const newEarningAmount = !isExpense ? data.amount : 0;

      const totalExpenseChange = isExpense ? newExpenseAmount - (editItem?.expense_amount || 0) : 0;
      const totalEarningChange = !isExpense ? newEarningAmount - (editItem?.earning_amount || 0) : 0;

      const updatedTotalExpense = (parseFloat(editData?.total_expense || 0) + totalExpenseChange).toFixed(2);
      const updatedTotalEarning = (parseFloat(editData?.total_earning || 0) + totalEarningChange).toFixed(2);

      const eventData = {
        title: data.title,
        description: data.description,
        date: currentStamp(data.date),
        cid: editData.id,
        id: editItem.id,
        expense_amount: isExpense ? newExpenseAmount : null,
        earning_amount: !isExpense ? newEarningAmount : null,
        total_expense: updatedTotalExpense,
        total_earning: updatedTotalEarning,
      };

      await eventFunction(eventData);
      ToastSuccess(strings.successfully_saved);
      goBack();
    } catch (error) {
      ToastError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      const updatedTotalExpense = (parseFloat(editData?.total_expense || 0) - (editItem?.expense_amount || 0)).toFixed(2);
      const updatedTotalEarning = (parseFloat(editData?.total_earning || 0) - (editItem?.earning_amount || 0)).toFixed(2);

      await deleteEvent({
        id: editItem.id,
        total_expense: updatedTotalExpense,
        total_earning: updatedTotalEarning,
        cid: editData.id,
      });

      ToastSuccess(strings.successfully_deleted);
      goBack();
    } catch (error) {
      ToastError(error?.message);
    } finally {
      setLoading(false);
    }
  }, [editData, editItem]);

  const updatingEntry = editItem?.expense_amount > 0 || editItem?.earning_amount > 0;

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header back label={editData?.name} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Input
            entering={FadeInDown.delay(350)}
            label={strings.title}
            autoFocus
            autoCapitalize="words"
            placeholder={strings.title}
            value={title}
            setValue={(value) => onChangeValue({ setData, key: 'title', value, isName: true })}
          />
          <Input
            entering={FadeInDown.delay(400)}
            label={strings.description}
            placeholder={strings.description} // Updated for localization
            multiline
            value={description}
            setValue={(value) => onChangeValue({ setData, key: 'description', value, isName: true })}
          />
          <Pressable
            onPress={() => {
              setShowDate(true);
              Keyboard.dismiss();
            }}>
            <Input
              entering={FadeInDown.delay(450)}
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
          <Text
            entering={FadeInDown.delay(500)}
            h4
            style={{ paddingTop: 10, display: updatingEntry ? 'none' : 'flex' }}>
            {strings.optional} {/* New key for optional text */}
          </Text>
          <Animated.View entering={FadeInDown.delay(500)} style={[common.row_btw]}>
            <Checkbox
              isChecked={isExpense === true}
              activeColor={colors.error}
              label={strings.expense}
              disabled={updatingEntry}
              style={{ width: '50%', marginVertical: 3, display: editItem?.earning_amount > 0 ? 'none' : 'flex' }}
              onPress={() => setIsExpense((prev) => (prev === undefined || prev === false ? true : undefined))}
            />
            <Checkbox
              isChecked={isExpense === false}
              label={strings.earning}
              activeColor={colors.success}
              disabled={updatingEntry}
              style={{ width: '50%', marginVertical: 3, display: editItem?.expense_amount > 0 ? 'none' : 'flex' }}
              onPress={() => setIsExpense((prev) => (prev === undefined || prev === true ? false : undefined))}
            />
          </Animated.View>
          <Input
            entering={FadeInDown.delay(550)}
            placeholder={'₹1000, ₹15,000....'}
            value={currencyInput(amount)}
            keyboardType={"numeric"}
            setValue={(value) => onChangeValue({ setData, key: 'amount', value, isAmount: true })}
          />
          <DateTimePick
            show={showDate}
            setShow={setShowDate}
            date={date}
            setDate={(value) => onChangeValue({ setData, key: 'date', value })}
          />
          <Button
            entering={FadeInDown.delay(600)}
            label={editItem?.id ? strings.update : strings.save}
            onPress={handleSubmit}
          />
          {editItem?.id && (
            <Button
              entering={FadeInDown.delay(600)}
              label={strings.delete}
              btnStyle={{ backgroundColor: colors.error }}
              onPress={handleDelete}
            />
          )}
        </View>
      </ScrollView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingBottom: 100,
    width: '100%',
  },
});
