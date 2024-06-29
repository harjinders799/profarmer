import React from 'react';
import {
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from 'src/components/button';
import Input from 'src/components/input';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { goBack } from 'src/navigation/ref';
import { strings } from 'src/translations/locale';
import Header from '../../components/header';
import Icon from '../../components/icon';
import auth from '@react-native-firebase/auth';
import { currentStamp } from 'src/utils/dateformat';
import Loader from 'src/components/loader';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import { submitLoan, updateLoanName } from '../../network/loan-service';
import { black } from '../../utils/color';



export default function AddLoan() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    id: editData?.id ?? 0,
    giver: auth().currentUser?.uid,
    receiver: editData?.name ?? '',
    detail: editData?.detail ?? '',
    phone: editData?.phone ?? '',
    amount: editData?.amount ?? 0,
    interest_rate: editData?.interest_rate ?? '',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { receiver, phone, interest_rate, date } = data;

  // React.useEffect(() => {
  //   if (givers.length == 1 && !giver) onChangeValue('giver', givers[0]);
  // }),
  //   [givers];


  const onChangeValue = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };
  const onPress = () => {
    if (editData?.name) updateWt();
    else AddNew();
  };
  const updateWt = async () => {
    if (!receiver || receiver.trim() == '') {
      ToastError(strings.receiver_name);
    } else if (interest_rate.trim() == '' || parseInt(interest_rate) <= 0) {
      ToastError(strings.interest_rate);
    } else {
      setLoading(true);
      await updateLoanName(
        editData?.name,
        { ...data, receiver: receiver.trim() }
      )
      setLoading(false);
      ToastSuccess(strings.update);
      goBack();
    }
  };
  const AddNew = async () => {
    if (!receiver || receiver.trim() == '') {
      ToastError(strings.receiver_name.trim());
      return;
    }
    if (interest_rate.trim() == '' || parseInt(interest_rate) <= 0) {
      ToastError(strings.interest_rate);
      return;
    }

    setLoading(true);
    await submitLoan({ ...data, receiver: receiver.trim(), date: currentStamp(date), })
    setLoading(false);
    ToastSuccess(strings.receiver_added);
    goBack();
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
            color={black}
            onPress={() => goBack()}
          />
        }
        centerComponent={<Text h2>{editData?.name ? strings.update : strings.add_loan}</Text>}
        rightComponent={<Text h2> </Text>}
      />
      <ScrollView style={styles.form} keyboardShouldPersistTaps="always">
        <Input
          label={strings.name}
          autoFocus
          placeholder={strings.receiver_name}
          value={receiver}
          setValue={value => onChangeValue('receiver', value)}
        />
        <Input
          label={strings.phone}
          placeholder={strings.phone}
          value={phone}
          setValue={value => onChangeValue('phone', value)}
          keyboardType="numeric"
        />
        <Input
          label={strings.interest}
          placeholder={strings.interest_rate}
          value={interest_rate}
          setValue={value => onChangeValue('interest_rate', value)}
          keyboardType="numeric"
        />
        <Button label={strings.save} onPress={onPress} />
      </ScrollView>
    </BaseView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },

  form: {
    paddingVertical: 15,
    width: '100%',
    marginVertical: 10,
  },
});
