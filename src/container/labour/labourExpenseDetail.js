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
  deleteLabour,
  deleteLabourExpense,
  getLabourExpense,
} from '../../network/labour-service';
import { goBack } from '../../navigation/ref';
import { currencyFormat } from '../../utils/dateformat';
import { gray2, white } from '../../utils/color';

export default function LabourExpenseDetail({ data, onPress }) {
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
            await deleteLabourExpense(data?.id);
            onPress();
            setLoading(false);
            ToastSuccess(strings.labour_expense_deleted, strings.labour);
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

  return (
    <View style={[styles.list, { backgroundColor: white }]}>
      <View style={styles.top}>
      <Loader visible={loading} />
      <View style={styles.row}>
        <Text h4 numberOfLines={1}>
          {dateFormat(data?.date)}
        </Text>
        <Text h4 numberOfLines={1}>
          {currencyFormat(data?.amount)}
        </Text>
      </View>
      {/* <Text h4 style={{ textAlign: 'center', paddingTop: 20 }}>
        {strings.remark}
      </Text> */}
      {/* <Text h4>{data?.detail}</Text> */}
      <View style={styles.icons}>
        <Icon
          name="delete"
          size={20}
          color={red}
          style={[styles.icon,]}
          onPress={delteData}
        />
        <Icon
          name="edit"
          size={20}
          color={orange}
          style={[styles.icon,]}
          onPress={() =>
            replace('AddLabourExpense', { data: { ...data, edit: true } })
          }
        />
      </View>
      </View>
      {data?.detail ?
        <Text h4 style={{paddingHorizontal:10}}>{data?.detail}</Text>
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
    paddingHorizontal:10,
  },
  list: {
    paddingVertical: 15,
    width: '98%',
    borderBottomWidth: 0.3,
    borderBottomColor: gray2
    // elevation: 3,
    // width: '98%',
    // padding: 20,
    // marginTop: 30,
    // // borderRadius: 10,
    // // borderWidth: 1,
  },
  row: {
    width: '70%',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
    justifyContent: 'space-between',
    // position: 'absolute',
    // top: -20,
  },
  icon: {},
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
