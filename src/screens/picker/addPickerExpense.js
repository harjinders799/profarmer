import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
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
import { useCotton } from '../../context/cottonContext';
import Text from '../../components/text';
import { savePickerExpenseData, updatePickerExpenseData } from '../../sql';
import auth from '@react-native-firebase/auth';

export default function AddPickerExpense() {
  const { colors } = useTheme();
  const { db, pickerExpense } = useCotton();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    id: editData?.id ?? '',
    uid: auth().currentUser?.uid,
    fid: editData?.fid ?? '',
    picker: editData?.picker ?? '',
    detail: editData?.detail ?? '',
    amount: editData?.amount ?? '',
    date: editData?.date ? new Date(parseInt(editData?.date)) : new Date(),
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
    try {
      if (amount.trim() == '' || amount < 0) {
        ToastError(strings.given_amount_to_picker);
      } else {
        setLoading(true);
        await updatePickerExpenseData(db, {
          ...data,
          amount: amount,
          date: currentStamp(date),
        })
        // let res = await updatePickerExpense({
        //   ...data,
        //   amount: amount,
        //   date: currentStamp(date),
        // });
        setLoading(false);
        ToastSuccess(strings.picker_expense_added);
        goBack();
      }
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
      console.log(error, '----addpickerExpense');
    }
  };
  const AddNew = async () => {
    try {
      if (picker == '') {
        ToastError(strings.picker_name);
      } else if (amount.trim() == '' || amount <= 0) {
        ToastError(strings.given_amount_to_picker);
      } else {
        setLoading(true);
        await savePickerExpenseData(db, [
          {
            ...data,
            picker: picker.trim(),
            date: currentStamp(date),
            id:
              Array.isArray(pickerExpense) && pickerExpense.length
                ? pickerExpense.reduce((acc, cur) => {
                  if (cur.id > acc.id) return cur;
                  return acc;
                }).id + 1
                : 1,
          },
        ]);
        // await submitPickerExpense({
        //   ...data,
        //   picker: picker.trim(),
        //   amount: amount,
        //   date: currentStamp(date),
        // });
        setLoading(false);
        ToastSuccess(strings.picker_expense_added);
        goBack();
      }
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
      console.log(error, '----addpickerExpense');
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
