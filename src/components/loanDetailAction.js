import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import Icon from './icon';
import Text from './text';
import { orange, red } from 'src/utils/color';
import { navigate, replace } from 'src/navigation/ref';
import { strings } from 'src/translations/locale';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import Loader from './loader';
import { dateTimeFormat } from 'src/utils/dateformat';
import { useRoute, useTheme } from '@react-navigation/native';
import moment from 'moment';
import { deleteLoan } from 'src/network/loan-service';
import { currencyFormat } from '../utils/dateformat';
import { goBack } from '../navigation/ref';
import auth from '@react-native-firebase/auth';
import { gray4, greenDark } from '../utils/color';

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
        <Text h5 numberOfLines={1} style={{ color: gray4 }}>
          {dateTimeFormat(data?.date)}
        </Text>
        <View style={[styles.row, { width: '100%' }]}>
          <View style={[styles.row, { width: '40%' }]}>
            {/* {strings.day} {days}
            {'\n'} */}
            <Text h5>
              {'Interest'}
            </Text>
            <Text h5>
              {currencyFormat(parseFloat(interest))}
            </Text>
          </View>
          <View style={[styles.row, { width: '40%' }]}>
            <Text
              h5
              style={{
                width: '100%',
                textAlign:
                  receiver == auth().currentUser.uid ? 'right' : 'left',
                color: receiver == auth().currentUser.uid ? red : greenDark,
              }}>
              {currencyFormat(parseFloat(amount))}
            </Text>
          </View>
        </View>

        <Text h5>{data?.detail}</Text>
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
