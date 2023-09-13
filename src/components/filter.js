import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useFocusEffect, useRoute, useTheme} from '@react-navigation/native';
import Modal from 'src/components/Modal';
import Input from 'src/components/input';
import Button from 'src/components/button';
import Header from 'src/components/header';
import {HEIGHT} from 'src/utils/constant';
import {strings} from 'src/translations/locale';
import BaseView from 'src/container/base';
import Icon from './icon';
import Loader from './loader';
import Text from './text';
import { currencyFormat } from '../utils/dateformat';
import { goBack } from '../navigation/ref';
import { greenDark, red } from '../utils/color';
import { sortBy, sumBy } from 'lodash';
import { useCotton } from '../context/cottonContext';


export default function Filter() {
  const {params} = useRoute();
  const data = params?.data ?? {};
  const [loading, setLoading] = React.useState(false);
  const {
    db,
    pickerWeight = [],
    pickerExpense,
    getPickerWeight,
    getPickerExpense,
  } = useCotton();

//   let pickerData = pickerWeight.filter(o => data?.picker === o.picker);
//   let pickerExpenseData = pickerExpense.filter(o => data?.picker === o.picker);
  let amount =
    sumBy(
      pickerWeight,
      o =>
      sumBy(pickerExpense, o => parseFloat(o.amount)))
        // parseFloat(o.weight) * (rate ? parseFloat(rate) : parseFloat(o.rate)),
  return (
    <BaseView style={styles.container}>
      <View
        style={[styles.list, {display: data?.weight != 0 ? 'flex' : 'none'}]}>
        <Loader visible={loading} />
        <Header
          style={{marginTop: 10}}
          leftComponent={
            <Icon name="back" size={28} onPress={() => goBack()} />
          }
          rightComponent={<Text h2> </Text>}
        />
        <View style={[styles.row]}>
          {/* <View style={{ width: '45%' }}> */}
          <View style={[styles.card, {backgroundColor: '#bbdffc'}]}>
            <Text h2 style={{fontWeight: 'bold'}}>
              {sumBy(pickerWeight, o => parseFloat(o.weight))} Kg
            </Text>
            <Text h3>{strings.total_weight}</Text>
          </View>
          </View>
      </View>
    </BaseView>
  );
}
          {/* <View style={[styles.card, {backgroundColor: '#ffccaa'}]}>
            <Text h2 style={{fontWeight: 'bold'}}>
              {currencyFormat(
                sumBy(
                  pickerWeight,
                //   o =>
                //     parseFloat(o.weight) * (rate ? rate : parseFloat(o.rate)),
                ),
              )}
            </Text>
            <Text h3>{strings.total_amount}</Text>
          </View>
          <View style={[styles.card, {backgroundColor: '#bee8ba'}]}>
            <Text h2 style={{fontWeight: 'bold'}}>
              -{' '}
              {currencyFormat(
                sumBy(pickerExpense, o => parseFloat(o.amount)),
              )}
            </Text>
            <Text h3>{strings.given_amount}</Text>
          </View>
       
          <View style={[styles.card, {backgroundColor: '#e5e5e5'}]}>
            <Text
              h2
              style={{
                fontWeight: 'bold',
                // color: (!isNaN(amount) ? amount : 0) > 0 ? greenDark: red,
              }}>
              {/* {(!isNaN(amount) ? amount : 0) > 0 ? '+' : ''} */}
//               {currencyFormat(o => parseFloat(pickerExpense) - (rate ? rate : parseFloat(o.rate)),)}
//             </Text>
//             <Text h3>{strings.final}</Text>
//           </View>
//          */}
//         </View>
//       </View>
//     </BaseView>
//   );
// }

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  list: {
    marginVertical: 15,
    width: '100%',
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
    flexWrap: 'wrap',
    // elevation: 5
  },
  card: {
    elevation: 5,
    backgroundColor: 'white',
    width: '100%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
