import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
import { goBack } from 'src/navigation/ref';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { useCotton } from '../../context/cottonContext';
import auth from '@react-native-firebase/auth';
import { gray3 } from '../../utils/color';
import { submitPrice, updatePrice } from '../../network/price-service';

export default function AddPrice() {
  const { colors } = useTheme();
  const { db, pickerWeight } = useCotton();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const [data, setData] = React.useState({
    id: editData?.id ?? '',
    commodity: editData?.commodity ?? '',
    uid: auth().currentUser?.uid,
    market: editData?.market ?? '',
    maxPrice: editData?.maxPrice ?? '',
    minPrice: editData?.minPrice ?? '',
    aavak: editData?.aavak ?? '',
    date: editData?.date ? new Date(parseInt(editData?.date)) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { commodity, market, date, maxPrice, minPrice, aavak } = data;
  // console.log(editData)
  const onChangeValue = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const onPress = () => {
    if (editData?.id) updateWt();
    else AddNew();
  };
  const updateWt = async () => {
    try {
      setLoading(true);
      await updatePrice({
        ...data,
        commodity: commodity.trim(),
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.weight_update);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
      console.log(error, '----addpicker');
    }
  };
  const AddNew = async () => {
    try {
      setLoading(true);
      await submitPrice({
        ...data,
        commodity: commodity.trim(),
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess(strings.new_weight_added, strings.picker);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
      console.log(error, '----addpicker');
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
        centerComponent={<Text h2>{'Add Price'}</Text>}
        rightComponent={<Text h2> </Text>}
      />
      <View style={styles.form}>
        <Input
          placeholder={'Commodity'}
          autoFocus
          value={commodity}
          setValue={value => onChangeValue('commodity', value)}
        />
        <Input
          placeholder={'Min Price'}
          value={minPrice}
          setValue={value => onChangeValue('minPrice', value)}
          keyboardType="numeric"
        />
        <Input
          placeholder={'Max Price'}
          value={maxPrice}
          setValue={value => onChangeValue('maxPrice', value)}
          keyboardType="numeric"
        />
        <Input
          placeholder={'Shahar'}
          autoCapitalize="words"
          value={market}
          setValue={value => onChangeValue('market', value)}
        />
        <TouchableOpacity
          style={[styles.date, { borderColor: gray3 }]}
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
