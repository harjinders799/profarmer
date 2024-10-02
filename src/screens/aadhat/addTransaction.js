import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, Keyboard, Pressable, View } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from '@components/button';
import Input from '@components/input';
import DateTimePick from '@components/DateTime';
import { currentStamp, dateFormat } from '@utils/dateformat';
import Loader from '@components/loader';
import BaseView from '@container/base';
import { ToastError, ToastSuccess } from '@utils/toast';
import { strings } from '@translations/locale';
import { navigate } from '@navigation/ref';
import Header from '@components/header';
import { currencyInput } from '@utils/dateformat';
import { FadeInDown } from 'react-native-reanimated';
import Checkbox from '@components/checkbox';
import { common } from '@utils/style';
import { useLang } from '@context/langContext';
import { addAmountTransaction, updateAmountTransaction } from '@network/aadhat-service';
import { onChangeValue } from '@utils/helper';

export default function AddTransaction() {
  const { colors } = useTheme();
  const { lang } = useLang();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const isCrop = params?.isCrop;
  const editItem = params?.item ?? {};

  const [showDate, setShowDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    crop: editItem?.crop ?? '',
    type: editItem?.type ?? (isCrop ? 'giver' : 'receiver'),
    weight: editItem?.weight ?? '',
    rate: editItem?.rate ?? '',
    detail: editItem?.detail ?? '',
    amount: (editItem?.amount ?? '').toString(),
    date: editItem?.date ? new Date(parseInt(editItem?.date)) : new Date(),
  });

  const { weight, rate, crop, type, amount, detail, date } = data;

  const validateAmount = useCallback(() => amount.trim() !== '' && amount > 0, [amount]);

  const handleSubmit = useCallback(async () => {
    if (!validateAmount()) {
      return ToastError(strings.credit_amount);
    }
    setLoading(true);
    try {
      const transactionData = { ...data, date: currentStamp(date) };
      if (editItem?.aid) {
        await updateAmountTransaction({ ...transactionData, aid: editData?.id, id: editItem?.id });
        ToastSuccess(strings.given_amount_added);
      } else {
        await addAmountTransaction({ aid: editData?.id, ...transactionData });
        ToastSuccess(strings.amount_added);
      }
      navigate('Aadhat');
    } catch (error) {
      ToastError(error?.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [data, date, editItem, editData, validateAmount]);

  return (
    <BaseView space>
      <Loader visible={loading} />
      <Header back label={editData.name ?? strings.add_transaction} />
      <ScrollView
        style={styles.form}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: '30%' }}>

        <View style={[common.centerAlignedJustify, { padding: 20, paddingTop: 0, display: isCrop ? 'none' : 'flex' }]}>
          <Checkbox
            isChecked={type === 'giver'}
            activeColor={colors.success}
            label={`${lang?.code !== 'en' ? strings.aadhtiya : ''} ${strings.gave_him} ${lang?.code === 'en' ? strings.aadhtiya : ''}`}
            style={{ width: '100%', marginTop: 10 }}
            onPress={() => onChangeValue({ setData, key: 'type', value: 'giver' })}
          />
          <Checkbox
            isChecked={type === 'receiver'}
            activeColor={colors.error}
            label={`${lang?.code !== 'en' ? strings.aadhtiya : ''} ${strings.received_from} ${lang?.code === 'en' ? strings.aadhtiya : ''}`}
            style={{ width: '100%', marginTop: 10 }}
            onPress={() => onChangeValue({ setData, key: 'type', value: 'receiver' })}
          />
        </View>

        {isCrop && (
          <Input
            entering={FadeInDown.delay(250)}
            label={strings.crop}
            placeholder={`${strings.crop} ${strings.name}`}
            value={crop}
            autoFocus
            setValue={value => onChangeValue({ setData, key: 'crop', value, isName: true })}
          />
        )}
        <Input
          entering={FadeInDown.delay(300)}
          label={isCrop ? strings.amount : type === 'receiver' ? strings.taken_amount : strings.given_amount}
          placeholder={'₹100,000...'}
          value={currencyInput(amount)}
          autoFocus={!isCrop}
          setValue={value => onChangeValue({ setData, key: 'amount', value, isAmount: true })}
          keyboardType="numeric"
        />

        {isCrop && (
          <View style={common.row_btw}>
            <Input
              entering={FadeInDown.delay(400)}
              label={strings.weight}
              placeholder={strings.weight}
              value={weight}
              setValue={value => onChangeValue({ setData, key: 'weight', value, isAmount: true })}
              style={{ width: '48%' }}
            />
            <Input
              entering={FadeInDown.delay(400)}
              label={strings.enter_rate}
              placeholder={strings.enter_rate}
              value={currencyInput(rate)}
              setValue={value => onChangeValue({ setData, key: 'rate', value, isAmount: true })}
              style={{ width: '48%' }}
            />
          </View>
        )}

        <Input
          entering={FadeInDown.delay(450)}
          label={strings.remark}
          placeholder={strings.remark}
          multiline
          value={detail}
          setValue={value => onChangeValue({ setData, key: 'detail', value })}
        />

        <Pressable onPress={() => { setShowDate(true); Keyboard.dismiss(); }}>
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
          setDate={value => onChangeValue({ setData, key: 'date', value })}
        />

        <Button
          entering={FadeInDown.delay(500)}
          label={strings.save}
          onPress={handleSubmit}
        />
      </ScrollView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
});
