import React, { useCallback, useEffect, useState } from 'react';
import Text from 'src/components/text';
import {
  FlatList,
  PixelRatio,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { white } from 'src/utils/color';
import _, { every, filter, find, groupBy, some, sortBy, sumBy } from 'lodash';
import { strings } from '../../translations/locale';
import { navigate } from 'src/navigation/ref';
import {
  getAllPickerExpense,
  getPickerExpense,
} from '../../network/picker-service';
import { ToastError } from '../../utils/toast';
import {
  green,
  red,
  yellow,
  black,
  orange,
  navy,
  greenDark,
  blue,
} from '../../utils/color';
import { currencyFormat, kg } from '../../utils/dateformat';
import Button from '../../components/button';
import { WIDTH } from '../../utils/constant';
import Animated, {
  BounceInDown,
  FadeIn,
  FadeInDown,
  FadeInUp,
  Layout,
  LightSpeedInLeft,
  LightSpeedInRight,
  LightSpeedOutLeft,
} from 'react-native-reanimated';
import Icon from '../../components/icon';
import Loader from '../../components/loader';
import { useCotton } from '../../context/cottonContext';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

export default function DateWiseList() {
  const [fullData, setFullData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pickerWeight, pickerExpense, getPickerWeight, getPickerExpense } =
    useCotton();

  // useFocusEffect(
  //   useCallback(() => {
  //     getPickerWeight();
  //     getPickerExpense();
  //   }, []),
  // );

  useEffect(() => {
    if (Array.isArray(pickerWeight) && pickerWeight.length) getExpense();
    else setFullData([]);
  }, [pickerWeight]);

  const getExpense = async () => {
    setLoading(true);
    let grpPicker = groupBy(pickerWeight, v => v.picker);
    try {
      let result = [];
      await Promise.all(
        Object.keys(grpPicker).map(async v => {
          let grpExpense = groupBy(pickerExpense, v => v.picker);
          result.push({
            picker: v,
            amount:
              sumBy(
                grpPicker[v],
                o => parseFloat(o.weight) * parseFloat(o?.rate),
              ) - sumBy(grpExpense[v], o => parseFloat(o.amount)),
            data: {
              expense: grpExpense[v],
              income: grpPicker[v],
            },
          });
        }),
      );
      setFullData(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, 'Picker');
    }
  };


  const renderItem = item => {
    let todayWeight = sumBy(filter(pickerWeight, o =>
      (moment().diff(moment(moment(o?.date).format('YYYY-MM-DD')), 'days')) == 0 && o?.picker == item?.picker),
      p => parseFloat(p.weight)) ?? 0
    let todayExpense = sumBy(filter(pickerExpense, o =>
      (moment().diff(moment(moment(o?.date).format('YYYY-MM-DD')), 'days')) == 0 && o?.picker == item?.picker),
      p => parseFloat(p.amount)) ?? 0
    return (
      <TouchableOpacity
        disabled={loading}
        style={[styles.list, styles.line]}
        onPress={() =>
          navigate(
            // item?.is_regulare ? 'RegularPickerDetail' : 'PickerDetail',
            'PickerDetail',
            { item },
          )
        }>
        {/* <View
          style={{
            // backgroundColor: 'red',
            // width: 10,
            // height: 10,
            alignSelf: 'center',
            top: -4,
            position: 'absolute',
          }}>
          <Text h6 style={{ color: orange }}>
            Today 44Kg
          </Text>
        </View> */}
        <View
          style={styles.row}
        // entering={LightSpeedInRight}
        // layout={Layout.easing}
        >
          <Text numberOfLines={1} h3 style={{ width: '60%' }}>
            {item?.picker}
          </Text>
          {!loading ? (
            <Text
              numberOfLines={1}
              h3
              style={{
                color: loading
                  ? greenDark
                  : (!isNaN(item?.amount) ? item?.amount : 0) >= 0
                    ? greenDark
                    : red,
              }}>
              {!loading
                ? currencyFormat(!isNaN(item?.amount) ? item?.amount : 0)
                : '__'}{' '}
            </Text>
          ) : (
            <Loader size={15} small visible={loading} />
          )}
        </View>
        <View
          style={[styles.row, { marginVertical: 0 }]}
        // entering={FadeIn}
        // layout={Layout.}
        >
          <Text h6 style={{ color: orange, fontWeight: 'bold' }}>
            Today{' '}
            <Text h6 style={{ color: '#d00000' }}>
              44Kg{' '}
            </Text>
            <Text h6 style={{ color: blue }}>
              100Rs
            </Text>
          </Text>
          <Text
            numberOfLines={1}
            h5
            style={{
              color: loading
                ? green
                : (!isNaN(item?.amount) ? item?.amount : 0) >= 0
                  ? greenDark
                  : red,
            }}>
            {!loading
              ? (!isNaN(item?.amount) ? item?.amount : 0) >= 0
                ? strings.give
                : strings.receive
              : '__'}{' '}
          </Text>
        </View>

        <View style={styles.row}>
          <Button
            hitSlop={10}
            label={strings.add_expense}
            btnStyle={{
              backgroundColor: blue,
              // marginRight: 10,
              width: 'auto',
              paddingHorizontal: 8,
              height: 25 * PixelRatio.getFontScale(),
              borderRadius: 5,
              marginVertical: 5,
            }}
            onPress={() =>
              navigate('AddPickerExpense', { data: { picker: item?.picker } })
            }
          />
          <Button
            hitSlop={10}
            label={strings.add_weight}
            btnStyle={{
              // marginRight: 10,
              width: 'auto',
              paddingHorizontal: 8,
              height: 25 * PixelRatio.getFontScale(),
              borderRadius: 5,
              marginVertical: 5,
            }}
            onPress={() =>
              navigate('AddPickerWeight', {
                data: {
                  picker: item?.picker,
                  rate: item.data.income[item.data.income.length - 1]?.rate,
                },
              })
            }
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={{ width: '100%' }}
      contentContainerStyle={{ paddingBottom: 150 }}
      data={sortBy(fullData, o => o?.picker)}
      keyExtractor={item => Math.random().toString()}
      ListEmptyComponent={() => (
        <Text style={{ textAlign: 'center', paddingTop: 30 }}>
          {strings.no_data}
        </Text>
      )}
      extraData={pickerWeight}
      showsVerticalScrollIndicator={false}
      // ItemSeparatorComponent={() => <View style={styles.line} />}
      renderItem={({ item }) => renderItem(item)}
    />
  );
}
const styles = StyleSheet.create({
  list: {
    marginVertical: 10,
    width: '100%',
    alignSelf: 'center',
    zIndex: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
    // elevation: 5,
    // backgroundColor: white
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // marginVertical: 5,
  },
  icon: {
    elevation: 1,
    width: 30,
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 5,
  },
});
