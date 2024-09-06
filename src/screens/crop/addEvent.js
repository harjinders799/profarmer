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
import { addNewCrop, submitEvent } from '@network/crop-service';
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
    amount: editItem?.amount ?? '',
    date: editItem?.date ? new Date(editItem?.date) : new Date(),
  });
  const [isExpense, setIsExpense] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const { title, description, amount, date } = data;

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      await submitEvent({
        title: data?.title,
        description: data?.description,
        date: currentStamp(data?.date),
        cid: editData?.id,
        expense_amount: isExpense ? data.amount : null,
        earning_amount:
          isExpense == false && isExpense != undefined ? data.amount : null,
        total_expense: isExpense
          ? (
            parseFloat(data.amount) + parseFloat(editData?.total_expense)
          ).toFixed(2)
          : editData?.total_expense,
        total_earning:
          isExpense == false && isExpense != undefined
            ? (
              parseFloat(data.amount) + parseFloat(editData?.total_earning)
            ).toFixed(2)
            : editData?.total_earning,
      });
      setLoading(false);
      ToastSuccess(strings.labour_added, strings.labour);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
    }
  }, [data]);

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
            autoCapitalize="words"
            placeholder={strings.title}
            value={title}
            setValue={value =>
              onChangeValue({ setData, key: 'title', value, isName: true })
            }
          />
          <Input
            entering={FadeInDown.delay(400)}
            label={strings.description}
            placeholder={'Plowing'}
            multiline
            value={description}
            setValue={value =>
              onChangeValue({ setData, key: 'description', value, isName: true })
            }
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
            />
          </Pressable>
          <Text entering={FadeInDown.delay(500)} h4 style={{ paddingTop: 10 }}>
            If Any (Optional)
          </Text>
          <Animated.View
            entering={FadeInDown.delay(500)}
            style={[common.row_btw]}>
            <Checkbox
              isChecked={isExpense == true}
              activeColor={colors.error}
              label={'Expense'}
              style={{ width: '50%', marginVertical: 3 }}
              onPress={() =>
                setIsExpense(prevs =>
                  prevs == undefined || prevs == false ? true : undefined,
                )
              }
            />
            <Checkbox
              isChecked={isExpense != undefined && isExpense == false}
              label={'Earning'}
              activeColor={colors.success}
              style={{ width: '50%', marginVertical: 3 }}
              onPress={() =>
                setIsExpense(prevs =>
                  prevs == undefined || prevs == true ? false : undefined,
                )
              }
            />
          </Animated.View>
          <Input
            entering={FadeInDown.delay(550)}
            placeholder={'₹1000, ₹1400...'}
            value={currencyInput(amount)}
            setValue={value =>
              onChangeValue({ setData, key: 'amount', value, isAmount: true })
            }
          />
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
        </View>
      </ScrollView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingVertical: 25,
    width: '100%',
  },
});
