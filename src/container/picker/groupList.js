import React, { memo, useCallback, useState } from 'react';
import Text from 'src/components/text';
import {
  FlatList,
  PixelRatio,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import _, { filter, groupBy, sortBy, sumBy } from 'lodash';
import { strings } from '../../translations/locale';
import { navigate } from 'src/navigation/ref';
import { ToastError } from '../../utils/toast';
import { green, red, greenDark, blue, white } from '../../utils/color';
import { currencyFormat, kg } from '../../utils/dateformat';
import Button from '../../components/button';
import Loader from '../../components/loader';
import { useCotton } from '../../context/cottonContext';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { getPickerFinal } from '../../sql';

export default function GroupList({ pickerWeight, pickerExpense }) {
  const [fullData, setFullData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { db } = useCotton();

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [pickerWeight, pickerExpense]),
  );

  const getData = async () => {
    try {
      let data = await getPickerFinal(db);
      setFullData(groupBy(data, o => o?.gname));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, 'Picker');
    }
  };

  const RenderItem = memo(({ item }) => {
    let finalAmount =
      sumBy(fullData[item], o => o?.total_rate_weight) -
      sumBy(fullData[item], o => o?.total_given_amount);
    return (
      <TouchableOpacity
        style={[styles.list]}
        onPress={() => navigate('GroupDetail', { name: item, data: fullData[item] })}>
        <View style={styles.row}>
          <Text numberOfLines={1} h3 style={{ width: '60%' }}>
            {item != 'null' ? item : 'Other'}
          </Text>
          {!loading ? (
            <Text
              numberOfLines={1}
              h3
              style={{
                color: loading
                  ? greenDark
                  : (!isNaN(finalAmount) ? finalAmount : 0) >= 0
                    ? greenDark
                    : red,
              }}>
              {!loading
                ? currencyFormat(!isNaN(finalAmount) ? finalAmount : 0)
                : '__'}{' '}
            </Text>
          ) : (
            <Loader size={15} small visible={loading} />
          )}
        </View>
        <View style={[styles.row,
          //  { justifyContent: 'center'}
        ]}>
          <Button
            hitSlop={10}
            label={'Edit'}
            btnStyle={{
              backgroundColor: blue,
              width: 'auto',
              paddingHorizontal: 15,
              height: 25 * PixelRatio.getFontScale(),
              borderRadius: 5,
              marginVertical: 5,
            }}
            onPress={() => navigate('Group',{ name: item, data: fullData[item] })}
          />
          <Text
            numberOfLines={1}
            // h3
            style={{
              fontSize: 15 / PixelRatio.getFontScale(),
              color: loading
                ? green
                : (!isNaN(finalAmount)
                  ? finalAmount
                  : 0) >= 0
                  ? green
                  : red,
            }}>
            {!loading
              ? (!isNaN(finalAmount)
                ? finalAmount
                : 0) >= 0
                ? strings.give
                : strings.receive
              : '__'}{' '}
          </Text>
        </View>

        {/* <View style={styles.row}>
         
          <Button
            hitSlop={10}
            label={strings.add_weight}
            btnStyle={{
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
                  rate: pickerWeight[pickerWeight.length - 1]?.rate,
                },
              })
            }
          />
        </View>  */}
      </TouchableOpacity>
    );
  });

  return (
    <FlatList
      style={{ width: '100%' }}
      contentContainerStyle={{ paddingBottom: 150 }}
      data={sortBy(Object.keys(fullData), o => o)}
      keyExtractor={item => Math.random().toString()}
      ListEmptyComponent={() => (
        <Text style={{ textAlign: 'center', paddingTop: 30 }}>
          {strings.no_data}
        </Text>
      )}
      extraData={fullData}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <RenderItem item={item} />}
    />
  );
}
const styles = StyleSheet.create({
  list: {
    marginVertical: 10,
    width: '100%',
    alignSelf: 'center',
    // zIndex: 9,
    width: '98%',
    elevation: 5,
    margin: '1%',
    padding: 5,
    borderRadius: 5,
    backgroundColor: white
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
});
