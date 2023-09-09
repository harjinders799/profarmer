import React, { useCallback, useEffect, useState } from 'react';
import Text from 'src/components/text';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { white } from 'src/utils/color';
import _, { every, filter, find, groupBy, some, sumBy } from 'lodash';
import { strings } from '../../translations/locale';
import { navigate } from 'src/navigation/ref';
import {
  getAllPickerExpense,
  getPickerExpense,
} from '../../network/picker-service';
import { ToastError } from '../../utils/toast';
import { green, red, yellow, black, orange, navy } from '../../utils/color';
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

export default function DateWiseList() {
  const [fullData, setFullData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pickerWeight, pickerExpense, getPickerWeight, getPickerExpense } =
    useCotton();

  useFocusEffect(
    useCallback(() => {
      getPickerWeight();
      getPickerExpense();
    }, []),
  );

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
    return (
      <Animated.View style={[styles.list, styles.line]}>
        <TouchableOpacity
          disabled={loading}
          onPress={() =>
            navigate(
              // item?.is_regulare ? 'RegularPickerDetail' : 'PickerDetail',
              'PickerDetail',
              { item },
            )
          }>
          <Animated.View
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
                    ? green
                    : (!isNaN(item?.amount) ? item?.amount : 0) >= 0
                      ? green
                      : red,
                }}>
                {!loading
                  ? currencyFormat(!isNaN(item?.amount) ? item?.amount : 0)
                  : '__'}{' '}
              </Text>
            ) : (
              <Loader size={15} small visible={loading} />
            )}
          </Animated.View>
          <Animated.View
            style={styles.row}
          // entering={FadeIn}
          // layout={Layout.}
          >
            <View style={{ flexDirection: 'row' }}>
              <Button
                hitSlop={10}
                label={strings.add_weight}
                btnStyle={{
                  marginRight: 10,
                  width: 'auto',
                  paddingHorizontal: 8,
                  height: 25,
                  borderRadius: 5,
                  marginVertical: 0,
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
              <Button
                hitSlop={10}
                label={strings.add_expense}
                btnStyle={{
                  backgroundColor: navy,
                  marginRight: 10,
                  width: 'auto',
                  paddingHorizontal: 8,
                  height: 25,
                  borderRadius: 5,
                  marginVertical: 0,
                }}
                onPress={() =>
                  navigate('AddPickerExpense', { data: { picker: item?.picker } })
                }
              />
            </View>
            <Text
              numberOfLines={1}
              h3
              style={{
                color: loading
                  ? green
                  : (!isNaN(item?.amount) ? item?.amount : 0) >= 0
                    ? green
                    : red,
              }}>
              {!loading
                ? (!isNaN(item?.amount) ? item?.amount : 0) >= 0
                  ? strings.give
                  : strings.receive
                : '__'}{' '}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <FlatList
      style={{ width: '100%' }}
      contentContainerStyle={{ paddingBottom: 100 }}
      data={fullData}
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
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
  icon: {
    elevation: 1,
    width: 30,
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 5,
  },
  line: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: WIDTH - 40,
  },
});
