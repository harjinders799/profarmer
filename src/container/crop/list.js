import React, { useEffect, useState } from 'react';
import Text from 'src/components/text';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { white } from 'src/utils/color';
import { filter, groupBy, sumBy } from 'lodash';
import { strings } from 'src/translations/locale';
import { navigate } from 'src/navigation/ref';
import { currencyFormat } from 'src/utils/dateformat';
import Button from '../../components/button';

export default function List({ data }) {
  return (
    // <FlatList
    //   style={{ width: '100%' }}
    //   contentContainerStyle={{ paddingBottom: 100 }}
    //   data={arr}
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
    // return (
    <View style={styles.list}>
      <TouchableOpacity onPress={() => navigate('CropDetail', { data })}>
        <View style={styles.row}>
          <Text numberOfLines={1} h3 style={{ width: '70%' }}>
            {strings.crop}
            {/* </Text>
          <Text h5>{strings.view}</Text>
        </View>
        <View style={styles.row}>
          <Text numberOfLines={1} h4>
             */}
          </Text>
          <Text numberOfLines={1} h4>
            {currencyFormat(sumBy(data, o => parseInt(o.amount)))}
            {/* {currencyFormat(item?.amount)} */}
          </Text>
        </View>
      </TouchableOpacity>
      <Button
        label={strings.add_crop}
        btnStyle={{
          width: 'auto',
          paddingHorizontal: 15,
          marginVertical: 0,
          display: Array.isArray(data) && data.length ? 'flex' : 'none',
        }}
        onPress={() =>
          navigate('AddCrop', {
            data: {
              interest_rate: data[data.length - 1]?.interest_rate,
            },
          })
        }
      />
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
  // line: {
  //   borderBottomWidth: StyleSheet.hairlineWidth,
  //   width: '100%',
  // },
});
