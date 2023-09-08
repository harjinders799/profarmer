import { View, StyleSheet, Alert } from 'react-native';
import React, { useEffect } from 'react';
import Icon from 'src/components/icon';
import Text from 'src/components/text';
import { orange, red } from 'src/utils/color';
import { navigate, replace } from 'src/navigation/ref';
import { strings } from 'src/translations/locale';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import Loader from 'src/components/loader';
import { dateFormat } from 'src/utils/dateformat';
import { useTheme } from '@react-navigation/native';
import moment from 'moment';
import { deleteIneterstAmt } from 'src/network/interest-service';
import {
  deletePicker,
  deletePickerExpense,
  getPickerExpense,
} from '../../network/picker-service';
import { goBack } from '../../navigation/ref';
import { currencyFormat } from '../../utils/dateformat';
import { gray2 } from '../../utils/color';
import { deletePickerExpenseData } from '../../sql';
import { useCotton } from '../../context/cottonContext';

export default function PickerExpenseDetail({ data, onPress }) {
  const [loading, setLoading] = React.useState(false);
  const { colors } = useTheme();
  const { db, getPickerExpense } = useCotton();

  const delteData = async () => {
    Alert.alert(
      `${data?.amount} Rs`,
      `${strings.delete_wt}`,
      [
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            await deletePickerExpenseData(db, data)
            getPickerExpense();
            if (data?.fid) await deletePickerExpense(data?.fid);
            // onPress();
            setLoading(false);
            ToastSuccess(strings.picker_expense_deleted, strings.picker);
            // goBack();
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
    <View style={styles.list}>
      <View style={styles.top}>
        <Loader visible={loading} />
        <View style={styles.row}>
          <Text h4 numberOfLines={1} style={{ width: '50%' }}>
            {dateFormat(data?.date)}
          </Text>
          <Text h4 numberOfLines={1} style={{ width: '40%' }}>
            {currencyFormat(data?.amount)}
          </Text>
        </View>
        <View style={styles.icons}>
          <Icon
            name="edit"
            size={20}
            color={orange}
            style={[styles.icon, { backgroundColor: colors.card }]}
            onPress={() =>
              navigate('AddPickerExpense', { data: { ...data, edit: true } })
            }
          />
          <Icon
            name="delete"
            size={20}
            color={red}
            style={[styles.icon, { backgroundColor: colors.card }]}
            onPress={delteData}
          />
        </View>
      </View>
      {data?.detail ?
        <Text h4>{data?.detail}</Text>
        : null}
    </View>
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
    paddingVertical: 15,
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
    // marginVertical: 5,
    // borderBottomWidth: 1,
    // borderStyle: 'dotted',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
    justifyContent: 'space-between',
  },
  icon: {
    // padding: 10,
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
