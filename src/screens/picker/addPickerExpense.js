import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useRoute, useTheme } from '@react-navigation/native';
import Button from 'src/components/button';
import Input from 'src/components/input';
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
import {
  getPickerByName,
  submitPicker,
  submitPickerExpense,
  updatePickerExpense,
} from '../../network/picker-service';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { currencyFormat, currencyInput } from '../../utils/dateformat';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useCotton } from '../../context/cottonContext';
import Text from '../../components/text';

export default function AddPickerExpense() {
  const { colors } = useTheme();
  const { setPicker, pickers } = useCotton();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    id: editData?.id ?? '',
    picker: editData?.picker ?? '',
    detail: editData?.detail ?? '',
    amount: editData?.amount ?? '',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { picker, detail, amount, date } = data;

  const onChangeValue = (key, value) => {
    if (key == 'amount') {
      setData({
        ...data,
        amount: value.replace(/[^0-9]/g, ''),
      });
    } else {
      setData({
        ...data,
        [key]: value,
      });
    }
    // if (key == 'picker' && Array.isArray(pickers) && pickers.length);
    // refAmt.current.focus();
  };

  const onPress = () => {
    if (editData.edit) updateWt();
    else AddNew();
  };
  const updateWt = async () => {
    if (picker == '') {
      ToastError(strings.picker_name, strings.picker);
    } else if (amount.trim() == '' || amount < 0) {
      ToastError(strings.given_amount_to_picker, strings.picker);
    } else {
      setLoading(true);
      let res = await updatePickerExpense({
        ...data,
        amount: amount,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.picker_expense_added, strings.picker);
      goBack();
    }
  };
  const AddNew = async () => {
    try {
      console.log('-----here 1')
      if (picker == '') {
        console.log('-----here 2')
        ToastError(strings.picker_name, strings.picker);
      } else if (amount.trim() == '' || amount <= 0) {
        console.log('-----here 3')
        ToastError(strings.given_amount_to_picker, strings.picker);
      } else {
        console.log('-----here 4')
        setLoading(true);
        await submitPickerExpense({
          ...data,
          picker: picker.trim(),
          amount: amount,
          date: currentStamp(date),
        });
        let exist = await getPickerByName(picker.trim());
        if (Array.isArray(exist) && !exist.length) {
          console.log('-----here 5')
          await submitPicker({
            weight: 0,
            rate: 0,
            picker: picker.trim(),
            date: currentStamp(date),
          });
          console.log('-----here 6')
        }
        setLoading(false);
        console.log('-----here 7')
        ToastSuccess(strings.picker_expense_added, strings.picker);
        let name = picker.trim();
        console.log('-----here 8')
        if (Array.isArray(pickers) && pickers.length) {
          console.log('-----here 9')
          let exist = pickers.findIndex(
            o => o.toUpperCase() === name.toUpperCase(),
          );
          console.log('-----here 10')
          if (exist == -1) {
            console.log('-----here 11')
            setPicker([...pickers, name]);
          }
        } else {
          console.log('-----here 12')
          setPicker([name]);
        }
        console.log('-----here 13')
        goBack();
      }
    } catch (error) {
      console.log(error, '----addpickerExpense')
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
        centerComponent={<Text h2 >{picker}</Text>}
        rightComponent={<Text h2> </Text>}
      />
      <View style={styles.form}>
        {/* <Text h2 style={{ textAlign: 'center', marginBottom: 20 }}>{picker}</Text> */}
        {/* <DataPicker
        data={pickers}
        intialVisible={!editData?.picker}
        placeholder={strings.picker_name}
        selectedItem={picker}
        setSelectedItem={val => {
          onChangeValue('picker', val);
        }}
      /> */}
        <Input
          refs={refAmt}
          autoFocus
          placeholder={strings.given_amount_to_picker}
          value={currencyInput(amount)}
          keyboardType="number-pad"
          setValue={value => onChangeValue('amount', value)}
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
