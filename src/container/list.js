import React, {useEffect, useState} from 'react';
import Text from 'src/components/text';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {white} from 'src/utils/color';
import {filter, groupBy, sumBy} from 'lodash';
import PickerRate from 'src/container/PickerRate';
// import PickerDetail from 'src/container/pickerDetail';
import {strings} from 'src/translations/locale';
import {dateFormat} from 'src/utils/dateformat';
import Icon from 'src/components/icon';
import {navigate} from 'src/navigation/ref';
import {currencyFormat} from '../utils/dateformat';

export default function List({data}) {
  const [rate, setRate] = useState();
  let arr = [];

  if (data.length) {
    let grp = groupBy(data, v => v.giver);
    Object.keys(grp).map(v =>
      arr.push({
        giver: v,
        total: sumBy(grp[v], o => parseInt(o.amount)),
        data: grp[v],
      }),
    );
  }

  return (
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
      ItemSeparatorComponent={() => <View style={styles.line} />}
      renderItem={({item}) => {
        return (
          <View style={styles.list}>
            <TouchableOpacity onPress={() => navigate('Detail', {item})}>
              <View style={styles.row}>
                <Text numberOfLines={1} h3 style={{width: '80%'}}>
                  {item?.giver}
                </Text>
                <Text h5>{strings.view}</Text>
                {/* <Icon name="more-horizontal" type="Feather" size={20} /> */}
              </View>
              <View style={styles.row}>
                <Text numberOfLines={1} h4>
                  {strings.total_principal}
                </Text>
                <Text numberOfLines={1} h4>
                  {currencyFormat(item?.total)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      }}
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
  line: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
