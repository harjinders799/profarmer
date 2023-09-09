import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
import { useStore } from 'src/context/context';
import { goBack } from 'src/navigation/ref';
import { updateIneterstAmt } from 'src/network/interest-service';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { currencyInput } from '../../utils/dateformat';
import { gray3 } from '../../utils/color';

export default function AddForm() {
  const { colors } = useTheme();
  const {
    setGivers,
    interest_rate: storeRate,
    setInterstRate,
    givers,
  } = useStore();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    id: editData?.id ?? '',
    giver: editData?.giver ?? '',
    detail: editData?.detail ?? '',
    amount: editData?.amount ?? '',
    interest_rate: editData?.interest_rate ?? storeRate ?? '',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { giver, detail, amount, interest_rate, date } = data;

  React.useEffect(() => {
    if (givers.length == 1 && !giver) onChangeValue('giver', givers[0]);
  }),
    [givers];

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
    if (key == 'giver' && Array.isArray(givers) && givers.length)
      refAmt.current.focus();
  };

  const onPress = () => {
    if (editData.giver) updateWt();
    else AddNew();
  };
  const updateWt = async () => {
    if (giver == '') {
      ToastError(strings.giver_name, strings.amount);
    } else if (amount.trim() == '' || parseInt(amount) <= 0) {
      ToastError(strings.taken_amount_from_aadhtiya, strings.amount);
    } else if (interest_rate.trim() == '' || parseInt(interest_rate) <= 0) {
      ToastError(strings.interest_rate, strings.amount);
    } else {
      setLoading(true);
      let res = await updateIneterstAmt({
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      setInterstRate(interest_rate);
      ToastSuccess(strings.amount_added, strings.amount);
      goBack();
    }
  };

  const AddNew = async () => {
    if (giver == '') {
      ToastError(strings.giver_name, strings.amount);
    } else if (amount.trim() == '' || parseInt(amount) <= 0) {
      ToastError(strings.taken_amount_from_aadhtiya, strings.amount);
    } else if (interest_rate.trim() == '' || parseInt(interest_rate) <= 0) {
      ToastError(strings.interest_rate, strings.amount);
    } else {
      setLoading(true);
      let res = await submitInterestAmount({
        ...data,
        giver: giver.trim(),
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.amount_added, strings.amount);
      let name = giver.trim();
      if (Array.isArray(givers) && givers.length) {
        let exist = givers.findIndex(
          o => o.toUpperCase() === name.toUpperCase(),
        );
        if (exist == -1) {
          setGivers([...givers, name]);
        }
      } else {
        setGivers([name]);
      }
      setInterstRate(interest_rate);
      goBack();
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
        centerComponent={<Text h2>{strings.aadhtiya}</Text>}
        rightComponent={<Text h2> </Text>}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.form}>
          <DataPicker
            data={givers}
            intialVisible={!editData?.giver}
            placeholder={strings.giver_name}
            selectedItem={giver}
            setSelectedItem={val => {
              onChangeValue('giver', val);
            }}
          />
          <Input
            refs={refAmt}
            placeholder={strings.taken_amount_from_aadhtiya}
            value={currencyInput(amount)}
            keyboardType="number-pad"
            setValue={value => onChangeValue('amount', value)}
          />
          <Input
            placeholder={strings.interest_rate}
            value={interest_rate}
            keyboardType="number-pad"
            setValue={value => onChangeValue('interest_rate', value)}
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
