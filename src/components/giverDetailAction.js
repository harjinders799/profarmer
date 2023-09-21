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
import { useTheme } from '@react-navigation/native';
import moment from 'moment';
import { deleteIneterstAmt } from 'src/network/interest-service';
import { currencyFormat } from '../utils/dateformat';
import { goBack } from '../navigation/ref';
import { gray3, green, lightGreen, lightOrange, white } from '../utils/color';

export default function GiverDetailAction({ data }) {
  const [loading, setLoading] = React.useState(false);
  const { colors } = useTheme();
  const delteData = async () => {
    Alert.alert(
      `${data?.amount} Rs`,
      `${strings.delete_wt}`,
      [
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            await deleteIneterstAmt(data?.id);
            setLoading(false);
            ToastSuccess(strings.amount_deleted, strings.amount);
            goBack();
          },
        },
        {
          text: 'No',
        },
      ],
      { cancelable: true },
    );
  };
  let date = moment(data?.date).format('YYYY-MM-DD');
  let start_date = moment(date);
  let today = moment();
  let days = today.diff(start_date, 'days');
  let interest = (
    ((parseFloat(data?.amount) * (parseFloat(data?.interest_rate) / 100)) /
      30) *
    parseInt(days)
  ).toFixed(2);
  let final_amount = parseFloat(data?.amount) + parseFloat(interest);
  return (
    <View style={styles.list}>
      <TouchableOpacity onPress={() => navigate('GiverUpdate', { data })}>
        <Loader visible={loading} />

        <View style={styles.row}>
          <Text
            h4
            style={{ width: '24%' }}
            numberOfLines={1}>
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
          {/* <Text h4>{currencyFormat(data?.amount)}</Text> */}
          <Text
            style={{ width: '26%', textAlign: 'right' }}
            h4>
            {currencyFormat(interest)}
          </Text>
          <Text
            style={{ width: '33%', textAlign: 'right' }}
            h4>
            {currencyFormat(final_amount)}
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
    // borderBottomWidth: 0.3,
    // borderBottomColor: "grey"
  },
  row: {
    width: '100%',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginVertical: 5,
    // borderBottomWidth: 1,
    // paddingVertical: 10,
    // borderStyle: 'dotted',
  },
  // icons: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   alignSelf: 'center',
  //   width: '100%',
  //   justifyContent: 'space-between',
  //   position: 'absolute',
  //   top: -20,
  // },
  // icon: {
  //   elevation: 3,
  //   padding: 10,
  //   borderRadius: 20,
  // },
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
