import * as React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Keyboard } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from 'src/components/button';
import Input from 'src/components/input';
import DateTimePick from 'src/components/DateTime';
import { currentStamp, dateFormat } from 'src/utils/dateformat';
import Loader from 'src/components/loader';
import BaseView from 'src/container/base';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import { strings } from 'src/translations/locale';
import { goBack } from 'src/navigation/ref';
import {
  deleteLabour,
  submitLabour,
  updateLabour,
} from '../../network/labour-service';
import Header from '../../components/header';
import { currencyInput } from '../../utils/dateformat';
import { FadeInDown } from 'react-native-reanimated';
import { common } from '@utils/style';

export default function AddLabour() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const labourData = params?.data ?? {};
  const editData = params?.item ?? {};
  const [data, setData] = React.useState({
    detail: editData?.detail ?? '',
    rate: editData?.rate ?? parseInt(labourData?.labour_rate).toString() ?? '',
    count: editData?.count ?? '',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { detail, rate, date, count } = data;
  console.log(editData);
  console.log(labourData);
  const onChangeValue = (key, value, isNumberOnly = false) => {
    setData({
      ...data,
      [key]: isNumberOnly ? value.replace(/[^0-9]/g, '') : value,
    });
  };

  const onPress = async () => {
    if (editData?.date && editData?.count && editData?.cid) updateData();
    else AddNew();
  };

  const updateData = async () => {
    if (rate.trim() == '' || parseInt(rate) <= 0) {
      return ToastError(strings.rate, strings.labour);
    }
    if (count.trim() == '' || parseInt(count) <= 0) {
      return ToastError(strings.labour_count, strings.labour);
    }
    try {
      setLoading(true);
      await updateLabour({
        ...data,
        date: currentStamp(date),
        cid: labourData?.id,
        id: editData?.id,
        total_labour_amount: (
          parseFloat(labourData?.total_labour_amount) +
          (parseFloat(count) * parseFloat(rate) -
            parseFloat(editData?.count) * parseFloat(editData?.rate))
        ).toFixed(2),
        total_labour_count: (
          parseFloat(labourData?.total_labour_count) +
          (parseFloat(count) - parseFloat(editData.count))
        ).toFixed(2),
        labour_rate: parseFloat(rate).toFixed(2),
      });
      setLoading(false);
      ToastSuccess(strings.labour_added, strings.labour);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.labour);
    }
  };

  const AddNew = async () => {
    try {
      if (rate.trim() == '' || parseInt(rate) <= 0) {
        ToastError(strings.rate, strings.labour);
      } else if (count.trim() == '' || parseInt(count) <= 0) {
        ToastError(strings.labour_count, strings.labour);
      } else {
        setLoading(true);
        await submitLabour({
          ...data,
          cid: labourData?.id,
          date: currentStamp(date),
          total_labour_amount: (
            parseFloat(labourData?.total_labour_amount) +
            parseFloat(count) * parseFloat(rate)
          ).toFixed(2),
          total_labour_count: (
            parseFloat(labourData?.total_labour_count) + parseFloat(count)
          ).toFixed(2),
        });
        setLoading(false);
        ToastSuccess(strings.labour_added, strings.labour);
        goBack();
      }
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteLabour(editData);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.labour);
    }
  };
  console.log({ editData });
  return (
    <BaseView style={styles.container}>
      <Loader visible={loading} />
      <Header back label={labourData?.name} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={common.row_btw}>
            <Input
              entering={FadeInDown.delay(350)}
              label={strings.labour_count}
              placeholder={'1, 2, 3...'}
              value={count}
              keyboardType="number-pad"
              setValue={value => onChangeValue('count', value, true)}
              style={{ width: '48%' }}
            />
            <Input
              entering={FadeInDown.delay(400)}
              label={strings.labour_rate}
              placeholder={' ₹300, ₹400...'}
              value={currencyInput(rate)}
              keyboardType="number-pad"
              setValue={value => onChangeValue('rate', value, true)}
              style={{ width: '48%' }}
            />
          </View>
          <Input
            entering={FadeInDown.delay(450)}
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
    paddingVertical: 25,
    width: '100%',
  },
  text: {
    // backgroundColor:"pink",
    marginTop: 5,
  },
  label: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    marginLeft: 20,
  },
});
