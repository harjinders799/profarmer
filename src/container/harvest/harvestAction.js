import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {navigate, replace} from 'src/navigation/ref';
import {strings} from 'src/translations/locale';
import {ToastError, ToastSuccess} from 'src/utils/toast';
import {dateFormat} from 'src/utils/dateformat';
import {useTheme} from '@react-navigation/native';
import moment from 'moment';
import Text from '../../components/text';
import Loader from '../../components/loader';
import {currencyFormat} from '../../utils/dateformat';
import {gray, green, red} from '../../utils/color';

export default function HarvestAction({data}) {
  const [loading, setLoading] = React.useState(false);
  const {colors} = useTheme();

  let amount = parseFloat(data.field) * parseFloat(data.rate);
  console.log(data, '---999--data--');

  return (
    <TouchableOpacity style={styles.list}>
      {/* onPress={() => navigate('GiverUpdate', {data})}> */}
      <Loader visible={loading} />
      <View style={styles.row}>
        <Text h4 style={{width: '20%'}} numberOfLines={1}>
          {dateFormat(data?.date)}
        </Text>
        <Text style={{width: '13%', textAlign: 'right'}} h4>
          {currencyFormat(data?.field)}
        </Text>
        {/* <Text h4>{currencyFormat(data?.amount)}</Text> */}
        <Text style={{width: '30%', textAlign: 'right'}} h4>
          {currencyFormat(data?.rate)}
        </Text>
        <Text style={{width: '35%', textAlign: 'right'}} h4>
          {currencyFormat(amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  list: {
    marginTop: 10,
    width: '100%',
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
