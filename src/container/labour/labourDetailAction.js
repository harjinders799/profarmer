import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from 'src/components/text';
import { navigate, replace } from 'src/navigation/ref';
import { strings } from 'src/translations/locale';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import Loader from 'src/components/loader';
import { dateFormat } from 'src/utils/dateformat';
import { useTheme } from '@react-navigation/native';
import { deleteLabour, getLabourExpense } from '../../network/labour-service';
import { gray2, green, white } from '../../utils/colors';
import { currencyFormat } from '../../utils/dateformat';

export default function LabourDetailAction({ data, totalExpense, totalLabour }) {
  const [loading, setLoading] = React.useState(false);
  const { getLabour } = useState();
  const delteData = async () => {
    Alert.alert(
      strings.labour,
      // `${data.count} ${strings.labour}`,
      `${strings.delete_wt} ${(data, rate?.labour)}`,
      [
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            if ((data, rate?.fid)) await deleteLabour(data, rate?.fid);
            getLabour();
            setLoading(false);
            ToastSuccess(strings.labour_deleted, strings.labour);
            // navigate('Labour');
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

      <TouchableOpacity
        style={styles.top}
        onPress={() => navigate('LabourUpdate', { data })}>
        {/* // onPress={() => goBack()}> */}
        <Loader visible={loading} />
        <View style={styles.row}>
          <Text h4 numberOfLines={1} style={styles.wt}>
            {dateFormat(data?.date)}
          </Text>
          <Text h4 numberOfLines={1} style={styles.wt}>
            {data?.count}
            {' ' + strings.labour}
          </Text>
          {/* <View style={styles.row}> */}
          {/* <Text h3>{strings.labour_rate}</Text> */}
          <Text h4 numberOfLines={1} style={styles.wt}>
            {currencyFormat(data?.rate)}</Text>
          {/* </View> */}
          {data?.is_regulare ?
            <Text style={{ color: green }}>{strings.regular}</Text>
            : (
              <View style={styles.icons}>
                {/* <Text h3>{strings.total_labour}</Text> */}
                <Text h4 numberOfLines={1} style={styles.wt}>
                  {currencyFormat(parseFloat(data?.rate) * parseFloat(data?.count))}
                </Text>
              </View>
            )}
          {/* <Text h4 style={{ textAlign: 'center', paddingTop: 20 }}>
        {strings.remark}
      </Text> */}
        </View>
        {/* <View style={styles.icons}>
          <Icon
          name="edit"
          size={20}
          color={orange}
          style={[styles.icon, { backgroundColor: gray2 }]}
          onPress={() => navigate('AddLabour', { data: { ...data, edit: true } })}
        />
        {data?.is_regulare ? (
          <Text h3 style={{ color: green, marginTop: 15 }}>
            {strings.regular}
          </Text>
        ) : null}
        {totalExpense < 1 || totalLabour > 1 ? (
          <Icon
            name="delete"
            size={20}
            color={red}
            style={[styles.icon, { backgroundColor: gray2 }]}
            onPress={delteData}
          />
        ) : null}
        </View> */}
      </TouchableOpacity>
      {data?.detail ? <Text h4 style={{ paddingHorizontal: 10 }}>{data?.detail}</Text> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  top: {
    // backgroundColor: "red",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10
  },
  list: {
    marginVertical: 15,
    width: '98%',
    borderBottomWidth: 0.3,
    borderBottomColor: gray2,
  },
  // list: {
  //   elevation: 3,
  //   width: '98%',
  //   padding: 20,
  //   marginTop: 30,
  //   // borderRadius: 10,
  //   // borderWidth: 1,
  // },
  row: {
    width: '100%',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    // borderBottomWidth: 1,
    // paddingVertical: 10,
    // borderStyle: 'dotted',
  },
  icons: {
    alignItems: 'flex-end',
    // flexDirection: 'row',
    // alignItems: 'center',
    // alignSelf: 'center',
    // width: '100%',
    // justifyContent: 'space-between',
    // position: 'absolute',
    // top: -20,
  },
  // icon: {
  //   elevation: 3,
  //   padding: 10,
  //   // borderRadius: 20,
  // },
  picker: {
    width: '40%',
  },
  farm: {
    textAlign: 'left',
  },
  wt: {
    // width: '35%',
    textAlign: 'right',

  },
});
