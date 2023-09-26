import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React from 'react';
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
import { deleteCrop } from 'src/network/interest-service';
import { currencyFormat } from 'src/utils/dateformat';
import { goBack } from 'src/navigation/ref';
import { gray2, green, white } from '../../utils/color';
import { ScrollView } from 'react-native-gesture-handler';

export default function CropDetailAction({ data }) {
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
            await deleteCrop(data?.id);
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
  let date = moment(data?.date).format("YYYY-MM-DD");
  let start_date = moment(date);
  let today = moment();
  let days = today.diff(start_date, 'days');
  let interest = (
    ((parseFloat(data?.amount) * (parseFloat(data?.interest_rate) / 100)) /
      30) *
    parseInt(days)
  ).toFixed(2);
  let final_amount = parseFloat(data?.amount) + parseFloat(interest);
  console.log("===============",data)
  return (
    <ScrollView style={{width:'100%'}}>
    <View style={styles.list}>
      {/* <Text h2 style={{ textAlign: 'center' }}>{data?.crop}</Text> */}
      <TouchableOpacity style={styles.top}
        onPress={() => navigate('CropUpdate', { data })}>
      <Loader visible={loading} />
      <View style={styles.row}>
        <Text h4 numberOfLines={1}>
          {dateFormat(data?.date)}
        </Text>
        <Text h4 numberOfLines={1}>
        {data?.crop}
          {/* {days} */}
        </Text>
        <Text h4>{currencyFormat(interest)}</Text>
        <Text h4>{currencyFormat(data?.amount)}</Text>
        </View>
      </TouchableOpacity >
    </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  row: {
    width: '100%',
    // marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal:20
    // borderBottomWidth: 1,
    // borderStyle: 'dotted',
  },

  // icons: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   alignSelf: 'center',
  //   width: '70%',
  //   justifyContent: 'space-between',
  //   position: 'absolute',
  //   bottom: "40%"
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
  list:{
    marginVertical:10,
    width:"100%"
  }
});
