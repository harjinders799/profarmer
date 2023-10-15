import React, { useEffect, useState } from 'react';
import Text from 'src/components/text';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { white } from 'src/utils/color';
import { filter, groupBy, sumBy } from 'lodash';
import { strings } from 'src/translations/locale';
import { navigate } from 'src/navigation/ref';
import { currencyFormat } from 'src/utils/dateformat';
import Button from '../../components/button';
import { useRoute } from '@react-navigation/native';


export default function TimeList() {
  const { params } = useRoute();
  const crop = params?.data ?? {};
  console.log(crop,'--555--')
  return (
    <View style={styles.list}>
      <TouchableOpacity onPress={() => navigate('TimeDetail', { crop })}>
        <View style={styles.row}>
          <Text numberOfLines={1} h3 style={{ width: '70%' }}>
            {crop?.crop}
            </Text>
          <Text h5>{strings.view}</Text>
        </View>
        <View style={styles.row}>
          <Text numberOfLines={1} h4>
            
          </Text>
          <Text numberOfLines={1} h4>
            {currencyFormat(sumBy(crop, o => parseInt(o.amount)))}
            {/* {currencyFormat(item?.amount)} */}
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
  // line: {
  //   borderBottomWidth: StyleSheet.hairlineWidth,
  //   width: '100%',
  // },
});
