import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import Icon from '../../components/icon';
import {
  cyan,
  gray1,
  gray4,
  green,
  greenLight,
  lightBlue,
  lightGreen,
  lightGrey,
  lightOrange,
  lightRed,
  lightYellow,
  orange,
  peach,
  red,
  white,
  yellow,
} from '../../utils/color';
import {ToastError, ToastSuccess} from '../../utils/toast';
import {deletePickerData, savePickerData, updatePickerData} from '../../sql';
import {useCotton} from '../../context/cottonContext';
import {deletePicker} from '../../network/picker-service';
import Loader from '../../components/loader';
import {useFocusEffect, useRoute, useTheme} from '@react-navigation/native';
import {goBack, navigate, replace} from '../../navigation/ref';
import Text from '../../components/text';
import {currencyFormat, currentStamp, dateFormat} from '../../utils/dateformat';
import Header from '../../components/header';
import Button from '../../components/button';
import {strings} from '../../translations/locale';
import BaseView from 'src/container/base';
import moment from 'moment';
import { deleteIneterstAmt } from '../../network/interest-service';
import { useAadt } from '../../context/aadtContext';

export default function GiverUpdate() {
  const {params} = useRoute();
  const data = params?.data ?? {};
  const [loading, setLoading] = React.useState(false);

  const { getAadt } = useAadt();
 
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
            getAadt();
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
    <BaseView style={styles.container}>
      <View
        style={[styles.list, {display: data?.amount != 0 ? 'flex' : 'none'}]}>
        <Loader visible={loading} />
        <Header
          // style={{ width: '100%',backgroundColor:green}}
          leftComponent={
            <Icon name="back" size={28} color= {green} onPress={() => goBack()} />
          }
          centerComponent={<Text style={{color:green,fontWeight:"bold",fontStyle:"italic"}}h2>{data.giver}</Text>}
          rightComponent={<Text h2> </Text>}
        />
        <View style={[styles.row]}>
       
          <View style={[styles.card, {borderColor: lightGreen, borderWidth: 3}]}>
            <Text h3 style={{fontWeight: 'bold'}}>
              {strings.total_principal}
            </Text>
            <Text h3 numberOfLines={1} style={{fontWeight: 'bold'}}>
              {currencyFormat(data?.amount)}
            </Text>
          </View>
          <View style={[styles.card, {borderColor: peach, borderWidth: 3}]}>
            <Text h3 style={{fontWeight: 'bold'}}>
              {strings.interest}
            </Text>
            <Text h3 numberOfLines={1} style={{fontWeight: 'bold'}}>
              {currencyFormat(parseFloat(data?.interest_rate))}
            </Text>
          </View>
          <View
            style={[styles.card, {borderColor: cyan, borderWidth: 3}]}>
            <Text h3 style={{fontWeight: 'bold'}}>
              {strings.day}
            </Text>
            <Text h3 style={{fontWeight: 'bold'}}>
              {days}
            </Text>
          </View>
          <View style={[styles.card, {borderColor: lightRed, borderWidth: 3}]}>
            <Text h3 style={{fontWeight: 'bold'}}>
              {strings.total_interest}
            </Text>
            <Text h3 numberOfLines={1} style={{fontWeight: 'bold'}}>
              {currencyFormat(interest)}
            </Text>
          </View>
          <View
            style={[styles.card, {borderColor: greenLight, borderWidth: 3}]}>
            <Text h3 style={{fontWeight: 'bold'}}>
              {' '}
              {strings.total_amount}
            </Text>
            <Text h3 style={{fontWeight: 'bold'}}>
              {currencyFormat(final_amount)}
            </Text>
          </View>
          <View style={[styles.card, {borderColor: lightYellow, borderWidth: 3}]}>
            <Text h3 style={{fontWeight: 'bold'}}>
              {strings.date}
            </Text>
            <Text h3 style={{fontWeight: 'bold'}}>
              {dateFormat(data?.date)}
            </Text>
          </View>
        
          <View
            style={[
              styles.card,
              {
              
                borderColor: gray4,
                borderWidth: 3,
                display: data?.detail ? 'flex' : 'none',
                width:"100%",
              
              },
            ]}>
            <Text h3 style={{fontWeight: 'bold'}}>
              {' '}
              {strings.remark}
            </Text>
            <Text h3 style={{fontWeight: 'bold', width:"70%",textAlign:'right'}}>
              {data?.detail}
            </Text>
          </View>
        </View>
        <View style={styles.icons}>
          <Button
            iconName="edit"
            iconColor={white}
            label={strings.edit}
            btnStyle={{
              width: '40%',
            }}
            onPress={() => replace('AddForm', {data})}
          />
          <Button
            iconName="delete"
            iconColor={white}
            label={strings.delete}
            btnStyle={{
              width: '40%',
            }}
            onPress={delteData}
          />
        </View>
      </View>
    </BaseView>
  );
}

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
    paddingTop:50,
    // elevation: 5
  },
  card: {
    elevation: 5,
    backgroundColor: white,
    width: '100%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    // alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
