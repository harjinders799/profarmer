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
  deleteLabourLeave,
  submitLabourLeave,
  updateLabourLeave,
} from '../../network/labour-service';
import Header from '../../components/header';
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

  const onPress = async () => {
    if (editData?.date && editData?.count && editData?.cid) updateData();
    else AddNew();
  };

  console.log({ editData })
  console.log({ labourData })
  const updateData = async () => {
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
  };

  const AddNew = async () => {
    if (count.trim() == '' || parseInt(count) <= 0) {
      return ToastError(strings.count, strings.labour);
    }
    try {
      setLoading(true);
      await submitLabourLeave({
        ...data,
        date: currentStamp(date),
        total_leave: (
          parseFloat(labourData?.total_leave) + parseFloat(count)
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
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteLabourLeave(editData);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.labour);
    }
  };

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
  text: {
    marginTop: 10,
    marginLeft: 5,
    fontSize: 16,
  },
});
