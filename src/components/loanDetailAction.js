import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import Icon from './icon';
import Text from './text';
import {orange, red} from 'src/utils/color';
import {navigate, replace} from 'src/navigation/ref';
import {strings} from 'src/translations/locale';
import {ToastError, ToastSuccess} from 'src/utils/toast';
import Loader from './loader';
import {dateFormat} from 'src/utils/dateformat';
import {useRoute, useTheme} from '@react-navigation/native';
import moment from 'moment';
import {deleteLoan} from 'src/network/loan-service';
import {currencyFormat} from '../utils/dateformat';
import {goBack} from '../navigation/ref';
import auth from '@react-native-firebase/auth';
import {
  gray3,
  green,
  greenLight,
  lightOrange,
  lightRed,
  white,
} from '../utils/color';
import {useLoan} from '../context/loanContext';

export default function LoanDetailAction({data}) {
  const [loading, setLoading] = React.useState(false);
  const {loanData = []} = useLoan(); 
   const {  giver, receiver, amount, interest_rate } = data;

  // Calculate the amount with interest
  const amountWithInterest = parseFloat(amount) + (interest_rate * parseFloat(amount)) / 100;

  // Determine the color based on whether the giver and receiver are the same
  const color = giver === receiver ? 'black' : amountWithInterest >= 0 ? 'green' : 'lightred';

  const delteData = async () => {
    Alert.alert(
      `${data?.amount} Rs`,
      `${strings.delete_wt}`,
      [
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            await deleteLoan(data?.id);
            setLoading(false);
            ToastSuccess(strings.amount_deleted, strings.amount);
            goBack();
          },
        },
        {
          text: 'No',
        },
      ],
      {cancelable: true},
    );
  };
  let date = moment(data?.date).format('YYYY-MM-DD');
  let start_date = moment(date);
  let today = moment();
  let days = today.diff(start_date, 'days');
  let interest = (
    ((parseFloat(data?.amount) *
      (parseFloat(data?.interest_rate) / 100)) /
      30) *
    parseInt(days)
  ).toFixed(2);
  // let final_amount = parseFloat(data?.amount) + parseFloat(interest);
  console.log( '===============', data);
  return (
    <View style={styles.list}>
      <TouchableOpacity onPress={() => navigate('LoanUpdate', {data})}>
        <Loader visible={loading} />

        <View style={styles.row}>
          <Text h4 style={{width: '24%'}} numberOfLines={1}>
            {dateFormat(data?.date)}
          </Text>
          <Text
            style={{
              width: '11%',
              textAlign: 'center',
            }}
            h4>
            {days}
          </Text>
        </View>

        <View style={styles.row}>
          <Text h4>{currencyFormat(interest)}</Text>
          <Text
            style={{width: '33%', textAlign: 'right', color: data.giver === auth().currentUser?.uid ? green : lightRed }}
            h3style={{
              color: loading
                ? green
                : !isNaN(data?.total_amount) ? data?.total_amount  >= 0? green : lightRed : green,
              }}>
               
            {!loading
              ? currencyFormat(!isNaN(data?.total_amount) ? data?.total_amount : 0)
              : '__'}{' '}
          </Text>
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
    width: '100%',
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
