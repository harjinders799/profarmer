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
import { navigate, goBack } from '@navigation/ref';
import {
  deleteLabourLeave,
  submitLabourLeave,
  updateLabourLeave,
} from '@network/labour-service';
import Header from '@components/header';
import { FadeInDown } from 'react-native-reanimated';

export default function AddLabourLeave() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const labourData = params?.data ?? {};
  const editData = params?.item ?? {};
  const [data, setData] = React.useState({
    detail: editData?.detail ?? '',
    count: editData?.count ?? '',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { detail, date, count } = data;

  const onChangeValue = (key, value, isNumberOnly = false) => {
    setData({
      ...data,
      [key]: isNumberOnly ? value.replace(/[^0-9]/g, '') : value,
    });
  };

  const handleSubmit = React.useCallback(async () => {
    if (editData?.date && editData?.count && editData?.cid) updateData();
    else addNewData();
  }, [editData, data, labourData]);

  const updateData = React.useCallback(async () => {
    if (count.trim() == '' || parseInt(count) <= 0) {
      return ToastError(strings.rate, strings.labour);
    }
    try {
      setLoading(true);
      await updateLabourLeave({
        ...data,
        date: currentStamp(date),
        cid: labourData?.id,
        id: editData?.id,
        total_leave: (
          parseFloat(labourData?.total_leave) +
          (parseFloat(count) - parseFloat(editData?.count))
        ).toFixed(2),
      });
      setLoading(false);
      ToastSuccess(strings.labour_leave_added, strings.labour);
      navigate('Labour');
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.labour);
    }
  }, [data, editData, labourData, count, date]);

  const addNewData = React.useCallback(async () => {
    if (count.trim() == '' || parseInt(count) <= 0) {
      return ToastError(strings.count, strings.labour);
    }
    try {
      setLoading(true);
      await submitLabourLeave({
        ...data,
        date: currentStamp(date),
        total_leave: (
          (parseFloat(labourData?.total_leave) || 0) + parseFloat(count)
        ).toFixed(2),
        cid: labourData?.id,
      });
      setLoading(false);
      ToastSuccess(strings.labour_leave_added, strings.labour);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
    }
  }, [data, labourData, count, date]);

  const handleDelete = React.useCallback(async () => {
    try {
      setLoading(true);
      await deleteLabourLeave(editData, labourData);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.labour);
    }
  }, [editData]);

  return (
    <BaseView style={styles.container}>
      <Loader visible={loading} />
      <Header back label={labourData.name} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.form}>
          <Input
            entering={FadeInDown.delay(300)}
            label={strings.leave_count}
            placeholder={strings.leave_count + ' 1, 2, 3...'}
            autoFocus
            value={count}
            keyboardType="number-pad"
            setValue={value => onChangeValue('count', value, true)}
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
            setDate={data => onChangeValue('date', data)}
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
