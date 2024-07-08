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
  let interest = getInterest([{ ...item, interest_rate: data[0]?.interest_rate }]);
  let final_amount = parseFloat(item?.amount) + parseFloat(interest);

  return (
    <TouchableOpacity
      style={[
        styles.list,
        {
          borderBottomColor: colors.border,
          display: item.type == type ? 'flex' : 'none',
        },
      ]}
      onPress={() => navigate('AadhatTransactionDetail', { data, item })}>
      <View style={common.row_btw}>
        <Text h4>
          {days} <Text h8>{strings.day}</Text>
        </Text>
        <Text h4>{currencyFormat(parseFloat(item?.amount))}</Text>
        <Text h4>
          {currencyFormat(parseFloat(interest))}
          <Text h8>{'Int'}</Text>
        </Text>
        <Text right h4>
          {currencyFormat(final_amount)}
        </Text>
      </View>
      <View style={[common.row_bottom_btw, { marginTop: 10 }]}>
        <Text h4 color={colors.secondaryText} style={{ maxWidth: '80%' }}>
          {item?.detail}
        </Text>
        <Text h5 numberOfLines={1} color={colors.thirdText}>
          {dateFormat(item?.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  list: {
    margin: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 5,
  },
});
