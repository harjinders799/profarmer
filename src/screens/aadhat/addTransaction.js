import React, { useState } from 'react';
import { StyleSheet, ScrollView, Keyboard, Pressable, View } from 'react-native';
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
import Header from '../../components/header';
import { currencyInput } from '../../utils/dateformat';
import { FadeInDown } from 'react-native-reanimated';
import Checkbox from '@components/checkbox';
import { common } from '@utils/style';
import { useLang } from '@context/langContext';
import {
  addAmountTransaction,
  updateAmountTransaction,
} from '@network/aadhat-service';
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
    type: editItem?.type
      ? editItem?.type
      : editData?.type
        ? editData?.type
        : isCrop
          ? 'giver'
          : 'receiver',
    weight: editItem?.weight ?? '',
    rate: editItem?.rate ?? '',
    detail: editItem?.detail ?? '',
    amount: (editItem?.amount ?? '').toString(),
    date: editItem?.date ? new Date(parseInt(editItem?.date)) : new Date(),
  });

  const { weight, rate, crop, type, amount, detail, date } = data;

  const onPress = () => {
    if (editItem?.aid) updateData();
    else AddNew();
  };

  const updateData = async () => {
    try {
      if (amount.trim() == '' || amount < 0) {
        ToastError(strings.credit_amount);
      } else {
        setLoading(true);
        console.log(data);
        await updateAmountTransaction({
          ...data,
          aid: editData?.id,
          id: editItem?.id,
          date: currentStamp(date),
        });
        setLoading(false);
        ToastSuccess(strings.given_amount_added);
        navigate('Aadhat');
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
      await addAmountTransaction({
        aid: editData?.id,
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.amount_added);
      navigate('Aadhat');
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
      console.log(error, '----11--');
    }
  };

  return (
    <BaseView space>
      <Loader visible={loading} />
      <Header back label={editData.name ?? 'Add Transaction'} />
      <ScrollView
        style={styles.form}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: '30%' }}>
        <View
          style={[
            common.centerAlignedJustify,
            { padding: 20, paddingTop: 0, display: isCrop ? 'none' : 'flex' },
          ]}>
          <Checkbox
            isChecked={type == 'giver'}
            activeColor={colors.success}
            label={`${lang?.code !== 'en' ? strings.aadhtiya : ''} ${strings.gave_him
              } ${lang?.code == 'en' ? strings.aadhtiya : ''}`}
            style={{ width: '100%', marginTop: 10 }}
            onPress={() =>
              onChangeValue({ setData, key: 'type', value: 'giver' })
            }
          />
          <Checkbox
            isChecked={type == 'receiver'}
            activeColor={colors.error}
            label={`${lang?.code !== 'en' ? strings.aadhtiya : ''} ${strings.received_from
              } ${lang?.code == 'en' ? strings.aadhtiya : ''}`}
            style={{ width: '100%', marginTop: 10 }}
            onPress={() =>
              onChangeValue({ setData, key: 'type', value: 'receiver' })
            }
          />
        </View>
        <Input
          entering={FadeInDown.delay(250)}
          label={strings.crop}
          placeholder={`${strings.crop} ${strings.name}`}
          value={crop}
          autoFocus
          setValue={value =>
            onChangeValue({ setData, key: 'crop', value, isName: true })
          }
          style={{ display: isCrop ? 'flex' : 'none' }}
        />
        <Input
          entering={FadeInDown.delay(300)}
          label={
            type == 'receiver'
              ? strings.taken_amount
              : isCrop
                ? strings.amount
                : strings.given_amount
          }
          placeholder={'₹100,000...'}
          value={currencyInput(amount)}
          autoFocus={!isCrop}
          setValue={value =>
            onChangeValue({ setData, key: 'amount', value, isAmount: true })
          }
          keyboardType="numeric"
        />
        <View style={[common.row_btw, { display: isCrop ? 'flex' : 'none' }]}>
          <Input
            entering={FadeInDown.delay(400)}
            label={strings.weight}
            placeholder={strings.weight}
            value={weight}
            setValue={value =>
              onChangeValue({ setData, key: 'weight', value, isAmount: true })
            }
            style={{ width: '48%' }}
          />

          <Input
            entering={FadeInDown.delay(400)}
            label={strings.enter_rate}
            placeholder={strings.enter_rate}
            value={currencyInput(rate)}
            setValue={value =>
              onChangeValue({ setData, key: 'rate', value, isAmount: true })
            }
            style={{ width: '48%' }}
          />
        </View>
        <Input
          entering={FadeInDown.delay(450)}
          label={strings.remark}
          placeholder={strings.remark}
          multiline
          value={detail}
          setValue={value => onChangeValue({ setData, key: 'detail', value })}
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
