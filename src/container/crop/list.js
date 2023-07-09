import React, { useEffect, useState } from 'react';
import Text from 'src/components/text';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { white } from 'src/utils/color';
import { filter, groupBy, sumBy } from 'lodash';
import PickerRate from 'src/container/PickerRate';
import PickerDetail from 'src/container/pickerDetail';
import { strings } from 'src/translations/locale';
import { dateFormat } from 'src/utils/dateformat';
import Icon from 'src/components/icon';
import { navigate } from 'src/navigation/ref';
import { currencyFormat } from 'src/utils/dateformat';

export default function List({ data }) {
  // let arr = [];
  // if (data.length) {
  //   // let grp = groupBy(data, v => v.crop);
  //   (data).map((v, i) =>
  //     arr.push({
  //       total: sumBy(data, o => parseInt(o.amount)),
  //       data: v,
  //     }),
  //   );
  // }

  console.log(JSON.stringify(data), '-------')
  return (
    // <FlatList
    //   style={{ width: '100%' }}
    //   contentContainerStyle={{ paddingBottom: 100 }}
    //   data={data}
    //   keyExtractor={item => Math.random().toString()}
    //   ListEmptyComponent={() => (
    //     <Text style={{ textAlign: 'center', paddingTop: 30 }}>
    //       {strings.no_data}
    //     </Text>
    //   )}
    //   extraData={data}
    //   showsVerticalScrollIndicator={false}
    //   ItemSeparatorComponent={() => <View style={styles.line} />}
    //   renderItem={({ item }) => {
    //     return (
    <View style={styles.list}>
      <TouchableOpacity onPress={() => navigate('Detail', { data })}>
        <View style={styles.row}>
          <Text numberOfLines={1} h3 style={{ width: '80%' }}>
            {strings.crop}
          </Text>
          <Text h5>{strings.view}</Text>
        </View>
        <View style={styles.row}>
          <Text numberOfLines={1} h4>
            {strings.total_amount}
          </Text>
          <Text numberOfLines={1} h4>
            {currencyFormat(sumBy(data, o => parseInt(o.amount)))}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
    //     );
    //   }}
    // />
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
  line: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
