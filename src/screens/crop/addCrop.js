import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
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
import { useStore } from 'src/context/context';
import { goBack } from 'src/navigation/ref';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { submitCrop, updateCrop } from '../../network/interest-service';
import { currencyInput } from '../../utils/dateformat';
import { black, gray3, green, white } from '../../utils/color';

export default function AddCrop() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    id: editData?.id ?? '',
    detail: editData?.detail ?? '',
    amount: editData?.amount ?? '',
    interest_rate: editData?.interest_rate ?? '',
    crop: editData?.crop ?? '',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { detail, amount, crop, interest_rate, date } = data;


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
    };
  }
  const onPress = () => {
    if (editData.id) updateWt();
    else AddNew();
  };
  const updateWt = async () => {
    if (amount.trim() == '' || parseInt(amount) <= 0) {
      ToastError(strings.taken_amount, 'ProFarmer');
    } else if (crop.trim() == '' || parseInt(crop) <= 0) {
      ToastError(strings.crop, 'ProFarmer');
    } else {
      setLoading(true);
      let res = await updateCrop({
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess('strings.picker_amt_added', 'ProFarmer');
      goBack();
    }
  };

  const AddNew = async () => {
    if (amount.trim() == '' || parseInt(amount) <= 0) {
      ToastError(strings.amount, 'ProFarmer');
    } else if (crop.trim() == '' || parseInt(crop) <= 0) {
      ToastError(strings.crop, 'ProFarmer');
    } else if (interest_rate.trim() == '' || parseInt(interest_rate) <= 0) {
      ToastError(strings.interest_rate, 'ProFarmer');
    } else {
      setLoading(true);
      let res = await submitCrop({
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess('strings.picker_amt_added', 'ProFarmer');
      // let name = agent.trim();
      // if (Array.isArray(givers) && givers.length) {
      //   let exist = givers.findIndex(
      //     o => o.toUpperCase() === name.toUpperCase(),
      //   );
      //   if (exist == -1) {
      //     setGivers([...givers, name]);
      //   }
      // } else {
      //   setGivers([name]);
      // }
      goBack();
      // }
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
            color={black}
            onPress={() => goBack()}
          />
        }
        centerComponent={<Text h2>{strings.add_crop}</Text>}
        rightComponent={<Text h2> </Text>}
      />
      <ScrollView
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <Input
            autoFocus
            label={strings.crop}
            placeholder={strings.crop}
            value={crop}
            autoCapitalize="words"
            setValue={value => onChangeValue('crop', value)}
          />
          <Input
            label={strings.total_interest}
            placeholder={strings.interest_rate}
            value={interest_rate}
            keyboardType="number-pad"
            autoCapitalize="words"
            setValue={value => onChangeValue('interest_rate', value)}
          />
          <Input
            label={strings.total_amount}
            refs={refAmt}
            placeholder={strings.total_amount}
            value={currencyInput(amount)}
            keyboardType="number-pad"
            setValue={value => onChangeValue('amount', value)}
          />
          <Input
            label={strings.remark}
            placeholder={strings.remark}
            multiline
            autoCapitalize="words"
            value={detail}
            setValue={value => onChangeValue('detail', value)}
          />
          {/* <DataPicker
              data={givers}
              // intialVisible={!editData?.agent}
              placeholder={strings.aadhtiya}
              selectedItem={agent}
              setSelectedItem={val => {
                onChangeValue('agent', val);
              }}
            /> */}
          <TouchableOpacity
            style={[styles.date]}
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
    marginVertical: 15,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderColor: gray3
  },
  row: {
    width: '100%',
    // paddingVertical: 35,
  },
});
