import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import Icon from '../../components/icon';
import {
  cyan,
  gray4,
  green,
  greenLight,
  white,
} from '../../utils/color';
import { ToastError, ToastSuccess } from '../../utils/toast';
import Loader from '../../components/loader';
import { useFocusEffect, useRoute, useTheme } from '@react-navigation/native';
import { goBack, navigate, replace } from '../../navigation/ref';
import Text from '../../components/text';
import {  dateFormat } from '../../utils/dateformat';
import Header from '../../components/header';
import Button from '../../components/button';
import { strings } from '../../translations/locale';
import BaseView from 'src/container/base';
import moment from 'moment';
import { sortBy, groupBy, sumBy } from 'lodash';
import { deleteLoan } from '../../network/loan-service';
import auth from '@react-native-firebase/auth';
import { useDocument } from '../../context/docContext';

export default function DocumentUpdate() {
  const { params } = useRoute();
  const data = params?.data ?? {};
  const [loading, setLoading] = React.useState(false);

  const { documentData, getDocument} = useDocument();

  const deleteData = async () => {
    Alert.alert(
      `${data?.amount} Rs`,
      `${strings.delete_wt}`,
      [
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            await deleteLoan(data?.id);
            setLoading(false);
            ToastSuccess(strings.amount_deleted, strings.amount);
            getLoan();
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
  // const groupedData = groupBy(documentData, d =>
  //   d?.giver === auth().currentUser.uid ? d?.receiver.trim() : d?.giver.trim(),
  // );

  const givenAmountWithInterest = sumBy(documentData, o => {
    // if (o.giver.trim() === auth().currentUser.uid) {
    //   return parseInt(o?.amount) + (o?.interest_rate * o?.amount) / 100;
    // }
    return 0;
  });

  const takenAmountWithInterest = sumBy(documentData, o => {
    // if (o.receiver.trim() === auth().currentUser.uid) {
    //   return parseInt(o?.amount) + (o?.interest_rate * o?.amount) / 100;
    // }
    return 0;
  });

  const finalAmount = givenAmountWithInterest - takenAmountWithInterest;

  let date = moment(data?.date).format('YYYY-MM-DD');
  let start_date = moment(date);
  let today = moment();
  let days = today.diff(start_date, 'days');
  let interest = (
    ((parseFloat(data?.amount) * (parseFloat(data?.interest_rate) / 100)) /
      30) *
    parseInt(days)
  ).toFixed(2);
  let total_amount = parseFloat(data?.amount) + parseFloat(interest);

  return (
    <BaseView style={styles.list}>
      <Loader visible={loading} />
      <Header
        // style={{ width: '100%',backgroundColor:green}}
        leftComponent={
          <Icon name="back" size={28} color={green} onPress={() => goBack()} />
        }
        centerComponent={
          <Text h3 style={{ color: green, fontWeight: 'bold' }}>
            {data.giver == auth().currentUser.uid ? data?.receiver : data.giver}
          </Text>
        }
        rightComponent={<Text h2> </Text>}
      />
      <View style={[styles.row]}>
        <Text h3 style={{ marginBottom: 10 }}>
          {dateFormat(data?.date)}
        </Text>
        <View style={[styles.card, { borderColor: cyan + 80, borderWidth: 2 }]}>
          <Text h3 style={{ fontWeight: 'bold', width: '50%' }}>
            {strings.document_name}
          </Text>
          <Text h3 numberOfLines={1} style={{ fontWeight: 'bold' }}>
            {(data?.name)}
          </Text>
        </View>
        <View style={[styles.card, { borderColor: greenLight, borderWidth: 2 }]}>
          <Text h3 style={{ fontWeight: 'bold' }}>
            {strings.reminder_day}
          </Text>
          <Text h3 style={{ fontWeight: 'bold' }}>
            {days}
          </Text>
        </View>
        <View
          style={[
            styles.card,
            {
              borderColor: gray4,
              borderWidth: 3,
              display: data?.detail ? 'flex' : 'none',
              width: '100%',
            },
          ]}>
          <Text h3 style={{ fontWeight: 'bold' }}>
            {' '}
            {strings.remark}
          </Text>
          <Text
            h3
            style={{ fontWeight: 'bold', width: '70%', textAlign: 'right' }}>
            {data?.detail}
          </Text>
        </View>
      </View>
      <View style={styles.button}>
        <Button
          iconName="edit"
          iconColor={white}
          label={strings.edit}
          btnStyle={{
            width: '40%',
          }}
          onPress={() =>
            replace('AddCredit', {
              data: {
                ...data,
                type: data?.giver == auth().currentUser.uid ? 'debt' : 'credit',
              },
            })
          }
        />
        <Button
          iconName="delete"
          iconColor={white}
          label={strings.delete}
          btnStyle={{
            width: '40%',
          }}
          onPress={deleteData}
        />
      </View>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  list: {
    marginVertical: 5,
    width: '100%',
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
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
