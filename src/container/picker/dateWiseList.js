import React, { useEffect, useState } from 'react';
import Text from 'src/components/text';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { white } from 'src/utils/color';
import _, { every, filter, find, groupBy, some, sumBy } from 'lodash';
import { strings } from 'src/translations/locale';
import { navigate } from 'src/navigation/ref';
import {
  getAllPickerExpense,
  getPickerExpense,
} from '../../network/picker-service';
import { ToastError } from '../../utils/toast';
import { green, red } from '../../utils/color';
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

export default function DateWiseList({ data }) {
  const [fullData, setFullData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data.length) getExpense();
    else setFullData([]);
  }, [data]);

  const getExpense = async () => {
    setLoading(true);
    let grpPicker = groupBy(data, v => v.picker);
    console.log(grpPicker, '----0------')
    try {
      let result = [];
      await Promise.all(
        Object.keys(grpPicker).map(async v => {
          let res = await getPickerExpense(v);
          let grpExpense = groupBy(res, v => v.picker);
          console.log(grpExpense, '----02------')
          result.push({
            picker: v,
            amount: sumBy(grpPicker[v], o => parseFloat(o.weight) * parseFloat(o?.rate)) - sumBy(grpExpense[v], o => parseFloat(o.amount)),
            data: {
              expense: grpExpense[v],
              income: grpPicker[v]
            }
          })
        })
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
          onPress={() =>
            navigate(
              // item?.is_regulare ? 'RegularPickerDetail' : 'PickerDetail',
              'PickerDetail', { item }
            )
          }>
          <View style={styles.row}>
            <Text numberOfLines={1} h3 style={{ width: '60%' }}>
              {item?.picker}
            </Text>
            <Text h5>{strings.view}</Text>
          </View>
          <Animated.View
            style={styles.row}
            entering={FadeInUp}
            layout={Layout.springify}>
            <Text numberOfLines={1} h4>
              {strings.final}
            </Text>
            <Text
              numberOfLines={1}
              h3
              style={{
                color: loading
                  ? green
                  : (!isNaN(item?.amount) ? item?.amount : 0) > 0
                    ? green
                    : red,
              }}>
              {!loading
                ? currencyFormat(
                  (!isNaN(item?.amount) ? item?.amount : 0),
                )
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
      extraData={data}
      showsVerticalScrollIndicator={false}
      // ItemSeparatorComponent={() => <View style={styles.line} />}
      renderItem={({ item }) => renderItem(item)}
    />
  );
}
const styles = StyleSheet.create({
  list: {
    borderRadius: 10,
    marginTop: 20,
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
