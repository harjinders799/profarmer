import React, {useEffect, useState} from 'react';
import Text from 'src/components/text';
import {FlatList, StyleSheet, View} from 'react-native';
import {white} from 'src/utils/color';
import {filter, groupBy, sumBy} from 'lodash';
import PickerRate from 'src/container/PickerRate';
import PickerDetail from 'src/container/pickerDetail';
import {strings} from 'src/translations/locale';

export default function CottonDateFilter({data}) {
  const [rate, setRate] = useState();
  let arr = [];

  if (data.length) {
    let grp = groupBy(data, v => v.picker);
    Object.keys(grp).map(v =>
      arr.push({
        picker: v,
        total: sumBy(grp[v], o => parseInt(o.weight)),
        data: grp[v],
      }),
    );
  }

  return (
    <>
      <PickerRate rate={rate} setRate={setRate} />

      <FlatList
        style={{width: '100%'}}
        contentContainerStyle={{paddingBottom: 100}}
        data={arr}
        keyExtractor={item => Math.random().toString()}
        ListEmptyComponent={() => (
          <Text style={{textAlign: 'center', paddingTop: 30}}>
            {strings.no_data}
          </Text>
        )}
        extraData={data}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          let totalAmt = 0;
          if (rate) {
            totalAmt = rate * item.total;
          }
          return <PickerDetail data={item} totalAmount={totalAmt} />;
        }}
      />
    </>
  );
}
const styles = StyleSheet.create({
  list: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: white,
    padding: 10,
    marginVertical: 10,
    width: '98%',
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
