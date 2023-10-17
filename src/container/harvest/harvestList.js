import React, {useEffect,useCallback, useState} from 'react';
import Text from 'src/components/text';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {white} from 'src/utils/color';
import {filter, groupBy, sumBy} from 'lodash';
import {strings} from 'src/translations/locale';
import {navigate} from 'src/navigation/ref';
import {currencyFormat} from 'src/utils/dateformat';
import Button from '../../components/button';
import {useIsFocused, useRoute} from '@react-navigation/native';
import { useHarvest } from '../../context/harvestContext';
import { getHarvestData } from '../../network/harvest_service';
import { useFocusEffect } from '@react-navigation/native';

export default function HarvestList ({data =[]}) {
  const {getHarvest, harvestData = [] } = useHarvest();
  const isFocused = useIsFocused();
  const [rate, setRate] = useState();
  const [loading, setLoading] = useState(true);
  // const groupedData = groupBy(data, 'crop');

  // useFocusEffect(
  //   useCallback(() => {
  //     getHarvest();
  //   }, [isFocused]),
  // );
  console.log(data); 
   useFocusEffect(
    useCallback(() => {
      getData();
        }, [isFocused]),
  );
  let totalamount =
    sumBy(
      harvestData,
      o =>
        parseFloat(o.amount) * (parseFloat(rate) ));


  const getData = async () => {
    try {
      setFullData(await getHarvestData(db));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, 'Harvest');
    }
  };

  const renderItem = (item) => {
    return (
      <View style={styles.list}>
        <TouchableOpacity onPress={() => navigate('HarvestDetail', {item})}>
          <View style={styles.row}>
            <Text numberOfLines={1} h3 style={{width: '70%'}}>
              {item.name}
            </Text>
            <Text h5>{strings.view}</Text>
          </View>
          <View style={styles.row}>
            <Text numberOfLines={1} h4></Text>
            <Text numberOfLines={1} h4>
               {/* {currencyFormat(item?.amount)} */}
               {currencyFormat(totalamount)}
              {/* {currencyFormat(sumBy(item, o => parseInt(o.amount)))} */}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      //     );
      //   }}
      // />
    );
  };

  return (
    <FlatList
    style={{ width: '100%' }}
    contentContainerStyle={{ paddingBottom: 150 }}
    data={data.sort((a, b) => {
      return moment(b.lastEntry.date) - moment(a.lastEntry.date);
    })}
    keyExtractor={item => Math.random().toString()}
    ListEmptyComponent={() => (
      <Text style={{ textAlign: 'center', paddingTop: 30 }}>
        {strings.no_data}
      </Text>
    )}
    showsVerticalScrollIndicator={false}
    renderItem={({ item }) => renderItem(item)}
  />
  );
}
const styles = StyleSheet.create({
  list: {
    borderRadius: 10,
    // elevation: 3,
    paddingVertical: 10,
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
});
