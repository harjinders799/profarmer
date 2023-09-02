import {View, StyleSheet, Alert} from 'react-native';
import React from 'react';
import Icon from 'src/components/icon';
import {orange, red} from 'src/utils/color';
import {navigate, replace} from 'src/navigation/ref';
import {strings} from 'src/translations/locale';
import {ToastError, ToastSuccess} from 'src/utils/toast';
import Loader from 'src/components/loader';
import {dateFormat} from 'src/utils/dateformat';
import Text from '../../components/text';
import { deletePicker } from '../../network/picker-service';
import { goBack } from '../../navigation/ref';

export default function PickerDetailAction({data, picker}) {
  const [loading, setLoading] = React.useState(false);

  const delteData = async () => {
    Alert.alert(
      strings.weight,
      `${strings.delete_wt} ${data?.weight}Kg`,
      [
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            await deletePicker(data?.id);
            setLoading(false);
            ToastSuccess(strings.weight_delete, 'Weight');
            goBack()
          },
        },
        {
          text: 'No',
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <View style={styles.list}>
      <Loader visible={loading} />
      <View style={styles.row}>
        <Text h4 numberOfLines={1} style={styles.picker}>
           { dateFormat(data?.date) }
          {/* {picker ? dateFormat(data?.date) : data?.picker} */}
        </Text>
        <Text h4 numberOfLines={1} style={styles.wt}>
          {data?.rate}Rs
        </Text>
        <Text h4 numberOfLines={1} style={styles.wt}>
          {data?.weight}kg
        </Text>
      </View>
      <View style={styles.icons}>
        <Icon
          name="edit"
          size={20}
          color={orange}
          onPress={() => replace('AddPicker', {data})}
        />
        <Icon name="delete" size={20} color={red} onPress={delteData} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '98%',
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
    width: '55%',
  },
  farm: {
    textAlign: 'left',
  },
  wt: {
    width: '25%',
    textAlign: 'right',
  },
});
