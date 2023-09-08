import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from 'src/components/button';
import Input from 'src/components/input';
import Text from 'src/components/text';
import DateTimePick from 'src/components/DateTime';
import { currentStamp } from 'src/utils/dateformat';
import Loader from 'src/components/loader';
import BaseView from 'src/container/base';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import { strings } from 'src/translations/locale';
import { navigate } from 'src/navigation/ref';
import { goBack } from 'src/navigation/ref';
import {
  getPickerByName,
  submitPicker,
  updatePicker,
} from '../../network/picker-service';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { useCotton } from '../../context/cottonContext';
import { savePickerData } from '../../sql';
import auth from '@react-native-firebase/auth';

export default function AddPicker() {
  const { colors } = useTheme();
  const { db, pickerWeight } = useCotton();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const [data, setData] = React.useState({
    id: editData?.id ?? 0,
    uid: auth().currentUser?.uid,
    fid: '',
    picker: editData?.picker ?? '',
    detail: editData?.detail ?? '',
    rate: editData?.rate ?? '',
    weight: editData?.weight ?? '0',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { picker, date, rate } = data;

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
  };

  const onPress = () => {
    if (editData?.edit) updateWt();
    else AddNew();
  };
  const updateWt = async () => {
    if (picker == '') {
      ToastError(strings.picker_name, strings.picker);
    } else if (rate.trim() == '' || parseInt(rate) <= 0) {
      ToastError(strings.rate, strings.picker);
      // } else if (count.trim() == '' || parseInt(count) <= 0) {
      //   ToastError(strings.picker_count, strings.picker);
    } else {
      setLoading(true);
      let res = await updatePicker({
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.picker_added, strings.picker);
      navigate('Picker');
    }
  };
  const AddNew = async () => {
    try {
      if (picker == '') {
        ToastError(strings.picker_name);
      } else if (rate.trim() == '' || parseInt(rate) <= 0) {
        ToastError(strings.enter_rate);
        // } else if (weight.trim() == '' || parseInt(weight) <= 0) {
        //   ToastError(strings.picker_weight, strings.picker);
      } else {
        setLoading(true);
        let isExist = await getPickerByName(picker.trim())
        if (Array.isArray(isExist) && isExist.length) {
          setLoading(false);
          ToastError(strings.picker_exist);
          return;
        }
        await savePickerData(db, [{
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
        }]);
        // await submitPicker({
        //   ...data,
        //   picker: picker.trim(),
        //   date: currentStamp(date),
        // });
        setLoading(false);
        ToastSuccess(strings.picker_added);
        // let name = picker.trim();
        // if (Array.isArray(pickers) && pickers.length) {
        //   let exist = pickers.findIndex(
        //     o => o.toUpperCase() === name.toUpperCase(),
        //   );
        //   if (exist == -1) {
        //     setPicker([...pickers, name]);
        //   }
        // } else {
        //   setPicker([name]);
        // }
        goBack()
        // }
      }
    } catch (error) {
      setLoading(false);
      ToastError(error?.message)
      console.log(error, '----addpicker')
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
        centerComponent={<Text h2>{strings.add_picker}</Text>}
        rightComponent={<Text h2> </Text>}
      />
      <View style={styles.form}>
        {/* <DataPicker
          data={pickers}
          intialVisible={!editData?.picker}
          placeholder={strings.picker_name}
          selectedItem={picker}
          setSelectedItem={val => {
            onChangeValue('picker', val);
          }}
        /> */}
        {/* <Input
          refs={refAmt}
          placeholder={strings.picker_count + ' 1, 2, 3...'}
          value={count}
          keyboardType="number-pad"
          setValue={value => onChangeValue('count', value)}
        /> */}
        {/* <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}> */}
        <Input
          placeholder={strings.name}
          value={picker}
          setValue={value => onChangeValue('picker', value)}
        // style={{ width: "45%" }}
        // keyboardType="numeric"
        />
        <Input
          placeholder={strings.enter_rate + '(Rs)'}
          value={rate}
          setValue={value => onChangeValue('rate', value)}
          // style={{ width: "45%" }}
          keyboardType="numeric"
        />
        {/* </View> */}
        {/* <Input
          placeholder={strings.remark}
          multiline
          autoCapitalize="words"
          value={detail}
          setValue={value => onChangeValue('detail', value)}
        /> */}
        {/* <TouchableOpacity
          style={[styles.date, { borderColor: colors.border }]}
          onPress={() => setShowDate(true)}>
          <Text h3 medium>
            {dateFormat(date)}
          </Text>
        </TouchableOpacity> */}
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
