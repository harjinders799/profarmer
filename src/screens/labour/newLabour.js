import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
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
import { strings } from 'src/translations/locale';
import { navigate } from 'src/navigation/ref';
import { useStore } from 'src/context/context';
import { goBack } from 'src/navigation/ref';
import { updateIneterstAmt } from 'src/network/interest-service';
import Checkbox from '../../components/checkbox';
import {
  addNewLabour,
  getLabourRagular,
  submitLabour,
  updateLabour,
} from '../../network/labour-service';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { currencyInput } from '../../utils/dateformat';
import { blue, gray3, black, orange } from '../../utils/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { common } from '@utils/style';
import firestore from '@react-native-firebase/firestore';

export default function NewLabour() {
  const { colors } = useTheme();
  const { setLabours, labours } = useStore();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const [data, setData] = React.useState({
    name: editData?.name ?? '',
    phone: editData?.phone ?? '',
    rate: editData?.rate ?? '',
    count: editData?.count ?? '',
    is_regular: editData?.is_regular ?? false,
    start_date: editData?.start_date ? new Date(editData?.start_date) : new Date(),
  });

  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { name, phone, rate, start_date, count, is_regular } = data;

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

  const onPress = async () => {
    if (editData?.id) updateWt();
    else AddNew();
  };

  const updateWt = async () => {
    if (name == '') {
      ToastError(strings.labour_name, strings.labour);
    } else if (rate.trim() == '' || parseInt(rate) <= 0) {
      ToastError(strings.rate, strings.labour);
    } else if (count.trim() == '' || parseInt(count) <= 0) {
      ToastError(strings.labour_count, strings.labour);
    } else {
      setLoading(true);
      let res = await updateLabour({
        ...data,
        start_date: currentStamp(start_date),
      });
      setLoading(false);
      ToastSuccess(strings.labour_added, strings.labour);
      navigate('Labour');
    }
  };
  const AddNew = async () => {
    if (!name) {
      return ToastError(strings.labour_name, strings.labour);
    }
    if (phone.trim() == '' || parseInt(phone) <= 0) {
      return ToastError(strings.phone, strings.labour);
    }
    if (rate.trim() == '' || parseInt(rate) <= 0) {
      return ToastError(strings.rate, strings.labour);
    }
    if (count.trim() == '' || parseInt(count) <= 0) {
      return ToastError(strings.labour_count, strings.labour);
    }
    try {
      setLoading(true);
      await addNewLabour({
        ...data,
        name: name.trim(),
        start_date: is_regular ? currentStamp(start_date) : undefined,
        total_labour_amount: (parseFloat(rate) * parseFloat(count)).toFixed(2),
        total_labour_count: parseFloat(count).toFixed(2),
        labour_rate: parseFloat(rate).toFixed(2),
        given_amount: "0.00"
      });
      setLoading(false);
      ToastSuccess(strings.labour_added, strings.labour);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.labour)
    }
  };

  return (
    <BaseView style={styles.container}>
      <Loader visible={loading} />
      <Header
        back
        label={strings.new_labour}
      />
      <ScrollView
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Input
          entering={FadeInDown.delay(300)}
          label={strings.labour_name}
          placeholder={strings.labour_name}
          value={name}
          setValue={value => onChangeValue('name', value)}
        />
        <Input
          entering={FadeInDown.delay(350)}
          label={strings.phone}
          placeholder={'9999XXXX99'}
          value={phone}
          maxLength={10}
          keyboardType="number-pad"
          setValue={value => onChangeValue('phone', value)}
        />
        <View style={common.row_btw}>
          <Input
            entering={FadeInDown.delay(400)}
            label={strings.labour_count}
            placeholder={'1, 2, 3...'}
            value={count}
            keyboardType="number-pad"
            setValue={value => onChangeValue('count', value)}
            style={{ width: '48%' }}
          />
          <Input
            entering={FadeInDown.delay(400)}
            label={strings.labour_rate}
            placeholder={' ₹300, ₹400...'}
            value={currencyInput(rate)}
            keyboardType="number-pad"
            setValue={value => onChangeValue('rate', value)}
            style={{ width: '48%' }}
          />
        </View>
        <Animated.View
          entering={FadeInDown.delay(500)}
          style={styles.label}>
          <Text h3> {strings.is_regular} </Text>
          <TouchableOpacity
            style={styles.button} onPress={() => onChangeValue('is_regular', true)}>
            <Text h3 style={{ color: data.is_regular ? blue : black + 50 }}>
              {strings.yes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button} onPress={() => onChangeValue('is_regular', false)}>
            <Text h3 style={{ color: data.is_regular ? black + 50 : blue }}>
              {strings.no} </Text>
          </TouchableOpacity>
        </Animated.View>

        {is_regular ? <Pressable
          onPress={() => {
            setShowDate(true);
            Keyboard.dismiss();
          }}
        >
          <Input
            entering={FadeInDown.delay(100)}
            label={strings.start_date}
            editable={false}
            value={dateFormat(start_date)}
            onPress={() => {
              setShowDate(true);
              Keyboard.dismiss();
            }}
          />
        </Pressable> : null}
        <DateTimePick
          show={showDate}
          setShow={setShowDate}
          date={start_date}
          setDate={data => onChangeValue('start_date', data)}
        />
        <Button
          entering={FadeInDown.delay(600)}
          label={strings.save} onPress={onPress} />
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
  text: {
    // backgroundColor:"pink",
    marginTop: 5,
  },
  label: {
    flexDirection: "row",
    width: '100%',
    alignItems: "center",
    marginTop: 20
  },
  button: {
    marginLeft: 20,
  },
});
