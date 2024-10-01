import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import Text from './text';
import { navigate } from 'src/navigation/ref';
import { dateTimeFormat, dayCount } from 'src/utils/dateformat';
import { useTheme } from '@react-navigation/native';
import moment from 'moment';
import { currencyFormat } from '../utils/dateformat';
import { common } from '@utils/style';
import { strings } from '@translations/locale';
import { getInterest } from '@utils/helper';
import auth from '@react-native-firebase/auth';

export default function LoanDetailAction({ data, item }) {
  const { colors } = useTheme();
  const { interest_rate } = data;
  const { type, amount } = item;
  const giver = type == 'giver' && data?.uid == auth()?.currentUser?.uid;

  let days = dayCount(item?.date);
  let interest = getInterest([{ ...item, interest_rate: interest_rate }]);

  return (
    <TouchableOpacity
      style={[styles.list, { display: amount == '0' ? 'none' : 'flex' }]}
      onPress={() => navigate('LoanUpdate', { data, item })}>
      <Text numberOfLines={1} color={colors.border}>
        {dateTimeFormat(item?.date)}
      </Text>
      <View style={[styles.row, { width: '100%' }]}>
        <View style={[styles.row, { width: '40%' }]}>
          <Text h4>
            {days} <Text h8>{strings.day}</Text>
          </Text>
          <Text h4>
            {currencyFormat(parseFloat(interest))}
            <Text h8>{'Int'}</Text>
          </Text>
        </View>
        <View style={[styles.row, { width: '40%' }]}>
          <Text
            h5
            style={{
              width: '100%',
              textAlign: giver ? 'right' : 'left',
              color: !giver ? colors.success : colors.error,
            }}>
            {currencyFormat(parseFloat(amount))}
            <Text h8 color={!giver ? colors.success : colors.error}>
              {giver ? 'Given' : 'Taken'}
            </Text>
          </Text>
        </View>
      </View>
      {item?.detail ? <Text h5>{item?.detail}</Text> : null}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  list: {
    marginTop: 30,
    width: '90%',
    marginHorizontal: '5%',
  },
  row: {
    ...common.row_btw,
    width: '50%',
    marginRight: 10,
  },
});
