import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import Icon from './icon';
import Text from './text';
import { orange, red } from 'src/utils/color';
import { navigate, replace } from 'src/navigation/ref';
import { strings } from 'src/translations/locale';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import Loader from './loader';
import { dateFormat } from 'src/utils/dateformat';
import { useRoute, useTheme } from '@react-navigation/native';
import moment from 'moment';
import { deleteLoan } from 'src/network/loan-service';
import { currencyFormat } from '../utils/dateformat';
import { goBack } from '../navigation/ref';
import auth from '@react-native-firebase/auth';
import { greenDark } from '../utils/color';

export default function LoanDetailAction({ data }) {
  const [loading, setLoading] = React.useState(false);
  const { giver, receiver, amount, interest_rate } = data;

  let date = moment(data?.date).format('YYYY-MM-DD');
  let start_date = moment(date);
  let today = moment();
  let days = today.diff(start_date, 'days');
  let interest = (
    ((parseFloat(amount) * (parseFloat(interest_rate) / 100)) / 30) *
    parseInt(days)
  ).toFixed(2);

  return (
    <View style={[styles.list, { display: amount == '0' ? 'none' : 'flex' }]}>
      <TouchableOpacity onPress={() => navigate('LoanUpdate', { data })}>
        <Loader visible={loading} />
        <Text h4 numberOfLines={1}>
          {dateFormat(data?.date)}
        </Text>
        <View style={[styles.row, { width: '100%' }]}>
          <Text
            style={{
              width: '40%',
            }}
            h4>
            {strings.day} {days}
            {'\n'}
            <Text h4>
              {strings.total_interest}{' '}
              {currencyFormat(parseFloat(interest) + parseFloat(amount))}
            </Text>
          </Text>
          <View style={[styles.row, { width: '40%' }]}>
            <Text
              h4
              style={{
                width: '100%',
                textAlign:
                  receiver == auth().currentUser.uid ? 'left' : 'right',
                color: receiver == auth().currentUser.uid ? greenDark : red,
              }}>
              {currencyFormat(parseFloat(amount))}
            </Text>
          </View>
        </View>

        <Text h4>{data?.detail}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  list: {
    marginVertical: 10,
    width: '100%',
  },
  row: {
    width: '50%',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  picker: {
    width: '55%',
  },
  farm: {
    textAlign: 'left',
  },
  wt: {
    width: '35%',
    textAlign: 'right',
  },
});
