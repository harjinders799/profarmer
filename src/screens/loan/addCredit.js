import React from 'react';
import {View, StyleSheet,ScrollView, TouchableOpacity} from 'react-native';
import {useRoute, useTheme} from '@react-navigation/native';
import Button from 'src/components/button';
import Input from 'src/components/input';
import Text from 'src/components/text';
import DateTimePick from 'src/components/DateTime';
import {currentStamp, dateFormat} from 'src/utils/dateformat';
import Loader from 'src/components/loader';
import BaseView from 'src/container/base';
import {ToastError, ToastSuccess} from 'src/utils/toast';
import {strings} from 'src/translations/locale';
import {navigate} from 'src/navigation/ref';
import {useStore} from 'src/context/context';
import {goBack} from 'src/navigation/ref';
import Header from '../../components/header';
import Icon from '../../components/icon';
import auth from '@react-native-firebase/auth';
import {gray10, gray3} from '../../utils/color';
import {useLoan} from '../../context/loanContext';
import { submitLoan } from '../../network/loan-service';

export default function AddCredit() {
  const {colors} = useTheme();
  const {getLoan } = useLoan();
  const {params} = useRoute();
  const editData = params?.data ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    id: editData?.id ?? '',
    giver: editData?.giver??auth().currentUser?.uid,
    detail: editData?.detail ?? '', 
    receiver: editData?.receiver ?? '',
    amount: editData?.amount ?? '',
    interest_rate: editData?.interest_rate ?? '',
    date: editData?.date ? new Date(parseInt(editData?.date)) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const {receiver,amount,detail, date} = data;

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
  };
  const onPress = () => {
    if (editData?.id) updateWt();
    else AddNew();
  };
  const updateWt = async () => {
    try {
      if (amount.trim() == '' || amount < 0) {
        ToastError(strings.credit_amount);
      } else {
            setLoading(true);
            await submitLoan({...data,date: currentStamp(date),})
        setLoading(false);
        ToastSuccess(strings.given_amount_added);
        goBack();
      }
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
      console.log(error, '----111---');
    }
  };
  const AddNew = async () => {  
      try {
    if (amount.trim() == '' || amount <= 0) {
      ToastError(strings.credit_amount);
      // return   
    }else {
    setLoading(true);
    await submitLoan({...data,date: currentStamp(date),})
    setLoading(false);
    ToastSuccess(strings.given_amount_added);
    goBack();
  };
} catch (error) {
  setLoading(false);
  ToastError(error?.message);
  console.log(error, '----11--');
}
};

  return (
    <BaseView style={styles.container}>
      <Loader visible={loading} />
      <Header
        style={{marginTop: 10}}
        leftComponent={
          <Icon
            name="back"
            size={28}
            color={colors.text}
            onPress={() => goBack()}
          />
        }
        centerComponent={<Text h2>{editData?.type=='debt'?editData?.receiver: editData.giver}</Text>}
        rightComponent={<Text h2> </Text>}
      />
      <ScrollView style={styles.form}>
        <Input
          label={strings.amount}
          placeholder={strings.amount + '(Rs)'}
          value={amount}
          autoFocus
          setValue={value => onChangeValue('amount', value)}
          keyboardType="numeric"
        />
        <Input
          label={strings.remark}
          placeholder={strings.remark}
          multiline
          autoCapitalize="words"
          value={detail}
          setValue={value => onChangeValue('detail', value)}
        />
        <Text
          style={{
            color: gray10,
            fontSize: 18,
            paddingTop: 5,
          }}>
          {strings.date}
        </Text>
        <TouchableOpacity
          style={[styles.date, {borderColor: gray3}]}
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
});
