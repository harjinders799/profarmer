import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
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
import {useStore} from 'src/context/context';
import {goBack} from 'src/navigation/ref';
import Header from '../../components/header';
import Icon from '../../components/icon';
import {currencyInput} from '../../utils/dateformat';
import {black, gray10, gray3, green, white} from '../../utils/color';
import auth from '@react-native-firebase/auth';
import {submitTimeline, updateTimeline} from '../../network/time-service';
import { submitHarvest, updateHarvest } from '../../network/harvest_service';

export default function AddHarvest() {
  const {colors} = useTheme();
  const {params} = useRoute();
  const editData = params?.data ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    id: editData?.id ?? '',
    uid: auth().currentUser?.uid,
    name: editData?.name ?? '',
    crop: editData?.crop ?? '',
    amount: editData?.amount ?? 0,
    crop: editData?.crop ?? '',
    rate: editData?.rate ?? '',
    field: editData?.field ?? '',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {crop, rate,field, amount, name, date} = data;

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
    
  };
  const onPress = () => {
    console.log(editData?.id, '---88---');
    if (editData?.id) updateWt();
    else AddNew();
  };
  console.log(editData, '---566---');
  const updateWt = async () => {
    if (name == '') {
      ToastError(strings.farmer_name);
    } else if (rate.trim() == '' || parseInt(rate) <= 0) {
      ToastError(strings.rate);
    // } else if (parseInt(amount) <= 0) {
    //   ToastError(strings.harvest);
    } else if (crop.trim() == '') {
      ToastError(strings.crop_name);
    } else if (field.trim() == '') {
      ToastError(strings.field);
    } else {
      setLoading(true);
      let res = await updateHarvest({
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.harvest_added, 'ProFarmer');
      goBack();
    }
  };

  const AddNew = async () => {
    if (name == '') {
      ToastError(strings.farmer_name);
    } else if (rate.trim() == '' || parseInt(rate) <= 0) {
      ToastError(strings.rate);
    } else if (crop.trim() == '') {
      ToastError(strings.crop_name);
    // } else if (amount.trim() == '' || parseInt(amount) <= 0) {
    //   ToastError(strings.harvest);
    } else if (field.trim() == '') {
      ToastError(strings.field);
    } else {
      setLoading(true);
      let res = await submitHarvest({
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.harvest_added, 'ProFarmer');
      goBack();
    }
  };
  console.log(amount, '---555---');

  console.log(editData, name, rate, '------666---', editData?.data);
  return (
    <BaseView style={styles.container}>
      {/* <Loader visible={loading} /> */}
      <Header
        // style={{marginTop: 10}}
        leftComponent={
          <Icon name="back" size={28} color={green} onPress={() => goBack()} />
        }
        centerComponent={
          <Text h2 style={{color: green, fontWeight: 'bold'}}>
            {/* {editData?.label} */}
            {strings.add_harvest}
          </Text>
        }
        rightComponent={<Text h2> </Text>}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.input}>
          <Input
            autoFocus
            label={strings.farmer_name}
            placeholder={strings.farmer_name}
            value={name}
            autoCapitalize="words"
            setValue={value => onChangeValue('name', value)}
          />
          <Input
            label={strings.crop_name}
            placeholder={strings.crop_name}
            autoCapitalize="words"
            value={crop}
            setValue={value => onChangeValue('crop', value)}
          />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            {/* <Input
              refs={refAmt}
              label={strings.harvest}
              placeholder={strings.harvest}
              value={amount}
              style={{width: '45%'}}
              keyboardType="number-pad"
              // autoCapitalize="words"
              setValue={value => onChangeValue('amount', value)}
            /> */}

            <Input
              label={strings.rate}
              // refs={refAmt}
              placeholder={strings.rate}
              value={currencyInput(rate)}
              style={{width: '45%'}}
              keyboardType="number-pad"
              setValue={value => onChangeValue('rate', value)}
            /> 
             <Input
            label={strings.field}
            placeholder={strings.field}
            autoCapitalize="words"
            style={{width: '45%'}}
            keyboardType="number-pad"
            value={field}
            setValue={value => onChangeValue('field', value)}
            />
            </View>
         <Text
              style={{
                color: gray10,
                fontSize: 18,
                paddingTop: 5,
              }}>
              {strings.date}
            </Text>
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
          <Button label={strings.save} onPress={AddNew} />
        </View>
      </ScrollView>
    </BaseView>
  );
}
const styles = StyleSheet.create({
  container: {

  },
  
  date: {
    borderWidth: 1,
    height: 50,
    width: '100%',
    borderRadius: 10,
    marginVertical: 15,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderColor: gray3,
  },
  input: {
    width: '95%',
    paddingVertical: 25,
  },
});
