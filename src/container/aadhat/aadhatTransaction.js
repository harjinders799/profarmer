import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { navigate, replace } from 'src/navigation/ref';
import { dateFormat, dayCount } from 'src/utils/dateformat';
import { useTheme } from '@react-navigation/native';
import { currencyFormat } from '@utils/dateformat';
import Text from '@components/text';
import { getInterest } from '@utils/helper';
import { strings } from '@translations/locale';
import { common } from '@utils/style';

export default function AadhatTransacton({ type, data, item }) {
  const { colors } = useTheme();
  let days = dayCount(item?.date);
  let interest = getInterest([
    { ...item, interest_rate: data[0]?.interest_rate },
  ]);
  let final_amount = parseFloat(item?.amount) + parseFloat(interest);

  return (
    <TouchableOpacity
      style={[
        styles.list,
        {
          backgroundColor: colors.secondaryCard,
          display: item.type == type ? 'flex' : 'none',
        },
      ]}
      onPress={() => navigate('AadhatTransactionDetail', { data, item })}>
      <View style={common.row_btw}>
        <Text color={colors.border}>{dateFormat(item?.date)}</Text>
        <Text h4 center>
          {currencyFormat(parseFloat(item?.amount))}
        </Text>
        <Text>+</Text>
        <Text h4 right>
          {currencyFormat(parseFloat(interest))}
          <Text h8>{'Int'}</Text>
        </Text>
      </View>
      <View style={[common.row_top_btw, { marginVertical: 10 }]}>
        <Text h4 left>
          {days} <Text h8>{strings.day}</Text>
        </Text>
        <Text right h4 bold>
          {currencyFormat(final_amount)}
        </Text>
      </View>
      {item?.detail ? (
        <Text h5 center>
          {item?.detail}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  list: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // ...common.shadow
  },
});
