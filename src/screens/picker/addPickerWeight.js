import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
import { submitPicker, updatePicker } from '../../network/picker-service';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { useCotton } from '../../context/cottonContext';
import { savePickerData, updatePickerData } from '../../sql';
import auth from '@react-native-firebase/auth';

export default function AddPickerWeight() {
  const { colors } = useTheme();
  const { db, pickerWeight } = useCotton();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    id: editData?.id ?? '',
    picker: editData?.picker ?? '',
    uid: auth().currentUser?.uid,
    fid: editData?.fid ?? '',
    detail: editData?.detail ?? '',
    rate: editData?.rate ?? '',
    weight: editData?.weight ?? '',
    date: editData?.date ? new Date(parseInt(editData?.date)) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { picker, detail, date, rate, weight } = data;

  const onChangeValue = (key, value) => {
    if (key == 'rate') {
      setData({
        ...data,
        rate: value.replace(/[^0-9.]+|(\..*\.)/g, ''),
      });
    } else {
      setData({
        ...data,
        [key]: value,
      });
    }
    // if (key == 'picker' && Array.isArray(pickers) && pickers.length)
    // refAmt.current.focus();
  };

  const onPress = () => {
    if (editData?.id) updateWt();
    else AddNew();
  };
  const updateWt = async () => {
    try {
      if (parseInt(rate) <= 0) {
        ToastError(strings.rate);
      } else if (parseInt(weight) <= 0) {
        ToastError(strings.picker_weight);
      } else {
        setLoading(true);
        await updatePickerData(db, {
          ...data,
          date: currentStamp(date),
        })
        setLoading(false);
        ToastSuccess(strings.weight_update);
        goBack();
      }
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
      console.log(error, '----addpicker');
    }
  };
  const AddNew = async () => {
    try {
      if (picker == '') {
        ToastError(strings.picker_name, strings.pickers);
      } else if (rate.trim() == '' || parseInt(rate) <= 0) {
        ToastError(strings.rate, strings.picker);
      } else if (weight.trim() == '' || parseInt(weight) <= 0) {
        ToastError(strings.picker_weight, strings.picker);
      } else {
        setLoading(true);
        await savePickerData(db, [
          {
            ...data,
            picker: picker.trim(),
            date: currentStamp(date),
            id:
              Array.isArray(pickerWeight) && pickerWeight.length
                ? pickerWeight.reduce((acc, cur) => {
                  if (cur.id > acc.id) return cur;
                  return acc;
                }).id + 1
                : 1,
          },
        ]);
        // await submitPicker(12{
        //   ...data,
        //   picker: picker.trim(),
        //   date: currentStamp(date),
        // });
        setLoading(false);
        ToastSuccess(strings.new_weight_added, strings.picker);
        goBack();
        // }
      }
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
      console.log(error, '----addpicker');
    }
  };

  return (
    <BaseView style={styles.container}>
      <Loader visible={loading} />
      <Header
        style={{ marginTop: 10 }}
        leftComponent={
          <Icon
            name="back"
            size={28}
            color={colors.text}
            onPress={() => goBack()}
          />
        }
        centerComponent={<Text h2>{picker}</Text>}
        rightComponent={<Text h2> </Text>}
      />
      <View style={styles.form}>
        {/* <Text h2 style={{ textAlign: 'center', marginBottom: 20 }}>{picker}</Text> */}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <Input
            placeholder={strings.weight + '(kg)'}
            value={weight}
            autoFocus
            setValue={value => onChangeValue('weight', value)}
            style={{ width: '45%' }}
            keyboardType="numeric"
          />
          <Input
            placeholder={strings.enter_rate + '(Rs)'}
            value={rate}
            setValue={value => onChangeValue('rate', value)}
            style={{ width: '45%' }}
            keyboardType="numeric"
          />
        </View>
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
        {/* <Checkbox
          isChecked={is_regulare}
          onPress={() => onChangeValue('is_regulare', !is_regulare)}
          label={strings.is_regular}
        /> */}
        <DateTimePick
          show={showDate}
          setShow={setShowDate}
          date={date}
          setDate={data => onChangeValue('date', data)}
        />
        <Button label={strings.save} onPress={onPress} />
      </View>
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
