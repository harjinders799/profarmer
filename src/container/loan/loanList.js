import React from 'react';
import Text from 'src/components/text';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { white } from 'src/utils/color';
import { groupBy, maxBy } from 'lodash';
import { strings } from 'src/translations/locale';
import { navigate } from 'src/navigation/ref';
import { currencyFormat } from 'src/utils/dateformat';
import {
  greenDark,
  red,
} from '../../utils/color';
import { useLoan } from '../../context/loanContext';
import auth from '@react-native-firebase/auth';
import { getTotalInterst } from '../../utils/helper';
import moment from 'moment';

export default function LoanList() {
  const { loanData = [] } = useLoan();
  let data = [];

  const groupedData = groupBy(loanData, d =>
    d?.giver == auth().currentUser.uid ? d?.receiver : d?.giver,
  );

  Object.keys(groupedData).map(o => {
    data.push({
      name: o,
      interest_rate: groupedData[o][0]?.interest_rate,
      lastEntry: maxBy(groupedData[o], entry => entry.date),
    });
  });
  console.log(data);
  const renderItem = item => {
    const given = getTotalInterst(
      groupedData[item?.name].filter(
        entry => entry.giver === auth().currentUser.uid,
      ),
    );
    const taken = getTotalInterst(
      groupedData[item?.name].filter(entry => entry.giver === item?.name),
    );

    return (
      <TouchableOpacity
        style={styles.list}
        onPress={() => navigate('LoanDetail', { item })}>
        <View style={styles.row}>
          <Text numberOfLines={1} h3 style={{ width: '60%' }}>
            {item?.name}
          </Text>
          <Text
            numberOfLines={1}
            h3
            style={{
              color: taken - given <= 0 ? red : greenDark,
            }}>
            {currencyFormat(taken - given)}
          </Text>
        </View>
        <View style={{ alignSelf: 'flex-end' }}>
          <Text
            numberOfLines={1}
            h3
            style={{
              color: taken - given <= 0 ? red : greenDark,
            }}>
            {taken - given <= 0 ? strings.give : strings.receive}
          </Text>
        </View>
      </TouchableOpacity>
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
    borderRadius: 5,
    elevation: 3,
    backgroundColor: white,
    paddingHorizontal: 10,
    padding: 5,
    margin: '1%',
    width: '98%',
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
