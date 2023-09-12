import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import Icon from 'src/components/icon';
import { orange, red } from 'src/utils/color';
import { navigate, replace } from 'src/navigation/ref';
import { strings } from 'src/translations/locale';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import Loader from 'src/components/loader';
import { dateFormat } from 'src/utils/dateformat';
import Text from '../../components/text';
import { deletePicker } from '../../network/picker-service';
import { goBack } from '../../navigation/ref';
import { gray1, gray2 } from '../../utils/color';
import { currencyFormat } from '../../utils/dateformat';
import { deletePickerData } from '../../sql';
import { useCotton } from '../../context/cottonContext';
import { sumBy } from 'lodash';

export default function PickerDetailAction({ data,rate,pickerData, picker }) {
  const [loading, setLoading] = React.useState(false);
  const { db, getPickerWeight } = useCotton();
  
  const delteData = async () => {
    Alert.alert(
      strings.weight,
      `${strings.delete_wt} ${data,rate?.weight}Kg`,
      [
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            await deletePickerData(db, data,rate)
            if (data,rate?.fid) await deletePicker(data,rate?.fid);
            getPickerWeight();
            setLoading(false);
            ToastSuccess(strings.weight_delete, 'Weight');
            // goBack()
          },
        },
        {
          text: 'No',
        },
      ],
      { cancelable: true },
    );
  };
  
  return (
    <View style={[styles.list, { display: data?.weight != 0 ? 'flex' : 'none' }]}>
      <View style={styles.top}>
        <Loader visible={loading} />
        <TouchableOpacity style={styles.row} onPress={() => navigate('PickerUpdate', { data })}>
          <Text h4 numberOfLines={1} style={styles.picker}>
            {dateFormat(data?.date)}
            {/* {picker ? dateFormat(data?.date) : data?.picker} */}
          </Text>
          <Text h4 numberOfLines={1} style={styles.wt}>
            {currencyFormat(rate?rate:data?.rate)}
            {/* {currencyFormat(
            sumBy(
                  pickerData,
                  o => (rate ? rate : parseFloat(o.rate)),
                ),)} */}
          </Text>
          <Text h4 numberOfLines={1} style={styles.wt}>
            {data?.weight}kg
          </Text>
        </TouchableOpacity>
        <View style={styles.icons}>
          <Text h4>
            {currencyFormat(
              parseFloat(data.weight) * parseFloat(data.rate)
            )}
          </Text>
          {/* <Icon
            name="edit"
            size={20}
            color={orange}
            onPress={() => navigate('AddPickerWeight', { data })}
          /> */}
          {/* <Icon name="delete" size={20} color={red} onPress={delteData} />/ */}
        </View>
      </View>
      {data?.detail ?
        <Text h4>{data?.detail}</Text>
        : null}
    </View >
  );
}
const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  list: {
    marginVertical: 15,
    width: '98%',
    borderBottomWidth: 0.3,
    borderBottomColor: gray2
  },
  row: {
    width: '70%',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
    justifyContent: 'space-between',
  },
  picker: {
    width: '40%',
  },
  farm: {
    textAlign: 'left',
  },
  wt: {
    width: '30%',
    textAlign: 'right',
  },
});
