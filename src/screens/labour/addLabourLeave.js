import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from 'src/components/button';
import Input from 'src/components/input';
import Text from 'src/components/text';
import DateTimePick from 'src/components/DateTime';
import { currentStamp, dateFormat } from 'src/utils/dateformat';
import Loader from 'src/components/loader';
import BaseView from 'src/container/base';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import { strings } from 'src/translations/locale';
import { navigate } from 'src/navigation/ref';
import { goBack } from 'src/navigation/ref';
import {
  submitLabourLeave,
  updateLabourLeave,
} from '../../network/labour-service';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { gray3 } from '../../utils/color';

export default function AddLabourLeave() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const editData = params?.item ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    id: editData?.id ?? '',
    labour: editData?.labour ?? '',
    detail: editData?.detail ?? '',
    count: editData?.count ?? '',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { labour, detail, date, count } = data;

  const onChangeValue = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const onPress = () => {
    if (editData.edit) updateWt();
    else AddNew();
  };
  const updateWt = async () => {
    if (labour == '') {
      ToastError(strings.labour_name, strings.labour);
    } else if (count.trim() == '' || parseInt(count) <= 0) {
      ToastError(strings.rate, strings.labour);
    } else {
      setLoading(true);
      let res = await updateLabourLeave({
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.labour_leave_added, strings.labour);
      navigate('Labour');
    }
  };
  const AddNew = async () => {
    if (labour == '') {
      ToastError(strings.err_picker, strings.labour);
    } else if (count.trim() == '' || parseInt(count) <= 0) {
      ToastError(strings.count, strings.labour);
    } else {
      setLoading(true);
      let res = await submitLabourLeave({
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.labour_leave_added, strings.labour);
      navigate('Labour');
      // }
    }
  };

  return (
    <BaseView style={styles.container}>
      <Loader visible={loading} />
      <Header
        leftComponent={
          <Icon
            name="back"
            size={28}
            color={colors.text}
            onPress={() => goBack()}
          />
        }
        centerComponent={<Text h2>{strings.add_labour}</Text>}
        rightComponent={<Text h2> </Text>}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.form}>
          <Input value={labour} editable={false} />
          <Input
            refs={refAmt}
            placeholder={strings.leave_count + ' 1, 2, 3...'}
            value={count}
            keyboardType="number-pad"
            setValue={value => onChangeValue('count', value)}
          />
          <Input
            placeholder={strings.remark}
            multiline
            autoCapitalize="words"
            value={detail}
            setValue={value => onChangeValue('detail', value)}
          />
          <TouchableOpacity
            style={[styles.date, { borderColor: gray3 }]}
            onPress={() => setShowDate(true)}>
            <Text h3 medium>
              {dateFormat(date)}
            </Text>
          </TouchableOpacity>
          <DateTimePick
            show={showDate}
            setShow={setShowDate}
            date={date}
            setDate={data => onChangeValue('date', data)}
          />
          <Button label={strings.save} onPress={onPress} />
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
  },
});
