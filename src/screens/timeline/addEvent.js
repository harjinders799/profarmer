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
import {black, gray3, green, white} from '../../utils/color';
import auth from '@react-native-firebase/auth';
import {submitTimeline, updateTimeline} from '../../network/time-service';

export default function AddEvent() {
  const {colors} = useTheme();
  const {params} = useRoute();
  const editData = params?.crop ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    id: editData?.id ?? '',
    uid: auth().currentUser?.uid,
    title: editData?.title ?? '',
    description: editData?.description ?? '',
    amount: editData?.amount ?? '',
    crop: editData?.crop ?? '',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {description, amount, title, date} = data;

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
  console.log(editData, '---88---');
  // const onPress = () => {
  //   if (editData.id) updateWt();
  //   else AddNew();
  // };console.log(editData,'---555---')
  // const updateWt = async () => {
  //   // if (title.trim() == '') {
  // if (!title || !title.trim()) {
  //     ToastError(strings.title);
  //   } else if (description.trim() == '') {
  //     ToastError(strings.description);
  //   } else {
  //     setLoading(true);
  //     let res = await updateTimeline({
  //       ...data,
  //       date: currentStamp(date),
  //     });
  //     setLoading(false);
  //     ToastSuccess('strings.picker_amt_added', 'ProFarmer');
  //     goBack();
  //   }
  // };

  const AddNew = async () => {
    if (!title || !title.trim()) {
      // if (title.trim() == '' ) {
      ToastError(strings.title);
    } else if (description.trim() == '') {
      ToastError(strings.description); 
    } else if ( amount.trim() == '' ||
    parseInt(amount) <= 0 ) {
        ToastError(strings.amount);
    } else {
      setLoading(true);
      let res = await submitTimeline({
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.crop_added, 'ProFarmer');
      goBack();
    }
  };
  console.log(amount, '---555---');

  console.log(editData, title, amount,'------666---',editData?.crop);
  return (
    <BaseView style={styles.container}>
      <Loader visible={loading} />
      <Header
        style={{marginTop: 10}}
        leftComponent={
          <Icon name="back" size={28} color={green} onPress={() => goBack()} />
        }
        centerComponent={
          <Text h2 style={{color: green, fontWeight: 'bold'}}>
            {editData?.crop}
          </Text>
        }
        rightComponent={<Text h2> </Text>}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <Input
            autoFocus
            label={strings.title}
            placeholder={strings.title}
            value={title}
            autoCapitalize="words"
            setValue={value => onChangeValue('title', value)}
          />
          <Input
            label={strings.description}
            placeholder={strings.description}
            multiline
            autoCapitalize="words"
            value={description}
            setValue={value => onChangeValue('description', value)}
          />
          <Input
            label={strings.total_amount}
            refs={refAmt}
            placeholder={strings.total_amount}
            value={currencyInput(amount)}
            keyboardType="number-pad"
            setValue={value => onChangeValue('amount', value)}
          />
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
    borderColor: gray3,
  },
  row: {
    width: '100%',
    // paddingVertical: 35,
  },
});
