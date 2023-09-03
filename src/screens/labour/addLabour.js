import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from 'src/components/button';
import Input from 'src/components/input';
import Text from 'src/components/text';
import DateTimePick from 'src/components/DateTime';
import { currentStamp, dateFormat } from 'src/utils/dateformat';
import { submitInterestAmount } from 'src/network/interest-service';
import Loader from 'src/components/loader';
import BaseView from 'src/container/base';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import DataPicker from 'src/components/dataPicker';
import { strings } from 'src/translations/locale';
import { navigate } from 'src/navigation/ref';
import { useStore } from 'src/context/context';
import { goBack } from 'src/navigation/ref';
import { updateIneterstAmt } from 'src/network/interest-service';
import Checkbox from '../../components/checkbox';
import {
  getLabourRagular,
  submitLabour,
  updateLabour,
} from '../../network/labour-service';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { currencyInput } from '../../utils/dateformat';

export default function AddLabour() {
  const { colors } = useTheme();
  const { setLabours, labours } = useStore();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    id: editData?.id ?? '',
    labour: editData?.labour ?? '',
    detail: editData?.detail ?? '',
    rate: editData?.rate ?? '',
    count: editData?.count ?? '',
    is_regulare: editData?.is_regulare ?? false,
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { labour, detail, rate, date, count, is_regulare } = data;

  const onChangeValue = (key, value) => {
    if (key == 'rate') {
      setData({
        ...data,
        rate: value.replace(/[^0-9]/g, ''),
      });
    } else {
      setData({
        ...data,
        [key]: value,
      });
    }
    if (key == 'labour' && Array.isArray(labours) && labours.length)
      refAmt.current.focus();
  };

  const onPress = () => {
    if (editData?.edit) updateWt();
    else AddNew();
  };
  const updateWt = async () => {
    if (labour == '') {
      ToastError(strings.labour_name, strings.labour);
    } else if (rate.trim() == '' || parseInt(rate) <= 0) {
      ToastError(strings.rate, strings.labour);
    } else if (count.trim() == '' || parseInt(count) <= 0) {
      ToastError(strings.labour_count, strings.labour);
    } else {
      setLoading(true);
      let res = await updateLabour({
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.labour_added, strings.labour);
      navigate('Labour');
    }
  };
  const AddNew = async () => {
    if (labour == '') {
      ToastError(strings.labour_name, strings.labour);
    } else if (rate.trim() == '' || parseInt(rate) <= 0) {
      ToastError(strings.rate, strings.labour);
    } else if (count.trim() == '' || parseInt(count) <= 0) {
      ToastError(strings.labour_count, strings.labour);
    } else {
      setLoading(true);
      await submitLabour({
        ...data,
        labour: labour.trim(),
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.labour_added, strings.labour);
      let name = labour.trim();
      if (Array.isArray(labours) && labours.length) {
        let exist = labours.findIndex(
          o => o.toUpperCase() === name.toUpperCase(),
        );
        if (exist == -1) {
          setLabours([...labours, name]);
        }
      } else {
        setLabours([name]);
      }
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
          <DataPicker
            data={labours}
            intialVisible={!editData?.labour}
            placeholder={strings.labour_name}
            selectedItem={labour}
            setSelectedItem={val => {
              onChangeValue('labour', val);
            }}
          />
          <Input
            refs={refAmt}
            placeholder={strings.labour_count + ' 1, 2, 3...'}
            value={count}
            keyboardType="number-pad"
            setValue={value => onChangeValue('count', value)}
          />
          <Input
            placeholder={strings.labour_rate + ' 300, 400...'}
            value={currencyInput(rate)}
            keyboardType="number-pad"
            setValue={value => onChangeValue('rate', value)}
          />
          <Input
            placeholder={strings.remark}
            multiline
            autoCapitalize="words"
            value={detail}
            setValue={value => onChangeValue('detail', value)}
          />
          <TouchableOpacity
            style={[styles.date, { borderColor: colors.border }]}
            onPress={() => setShowDate(true)}>
            <Text h3 medium>
              {dateFormat(date)}
            </Text>
          </TouchableOpacity>
          <Checkbox
            isChecked={is_regulare}
            onPress={() => onChangeValue('is_regulare', !is_regulare)}
            label={strings.is_regular}
          />
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
