import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import { white } from 'src/utils/color';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { goBack } from '../../navigation/ref';
import Loader from 'src/components/loader';
import { strings } from 'src/translations/locale';
import { ToastError } from '../../utils/toast';
import { deletePicker, getPickerExpense } from '../../network/picker-service';
import { ScrollView } from 'react-native-gesture-handler';
import Strings from 'react-native-localization';
import { green, red } from '../../utils/color';
import { currencyFormat } from '../../utils/dateformat';
import PickerDetailAction from '../../container/picker/pickerDetailAction';
import PickerExpenseDetail from '../../container/picker/pickerExpenseDetail';
import { navigate } from '../../navigation/ref';
import Button from '../../components/button';
import { mean, sortBy, sumBy } from 'lodash';
import moment from 'moment';

export default function PickerDetail({ navigation }) {
  const { params } = useRoute();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const data = params?.item ?? [];
  const [totalPicker, setTotalPicker] = useState(0);
  const [expense, setExpense] = useState([]);

  // useEffect(() => {
  //   getExpense();
  // }, [data]);

  // const getExpense = async () => {
  //   try {
  //     setLoading(true);
  //     let res = await getPickerExpense(data?.picker);
  //     setExpense(res);
  //     setLoading(false);
  //   } catch (error) {
  //     ToastError(error?.message, 'Picker');
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   if (Array.isArray(data.data) && data.data.length) {
  //     let tot = 0;
  //     data.data.map(v => {
  //       tot += parseFloat(v?.weight) * parseFloat(v?.rate);
  //     });
  //     setTotalPicker(tot);
  //   }
  // }, [data]);
  let expenseTot =
    Array.isArray(expense) && expense.length
      ? sumBy(expense, o => parseFloat(o?.amount))
      : 0;

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header
        leftComponent={
          <Icon
            name="back"
            size={28}
            onPress={() => goBack()}
          />
        }
        centerComponent={<Text h2>{data?.picker}</Text>}
        rightComponent={
          <Text numberOfLines={1} h4>
            {data?.picker ? strings.picker : ''}
          </Text>
        }
      />
      {/* <Header
        leftComponent={
          <Button
            label={strings.add_weight}
            btnStyle={{ width: '40%' }}
            onPress={() => navigate('Add Cotton Weight')}
          />
        }
        rightComponent={
          <Button
            label={strings.add_expense}
            btnStyle={{ width: '40%' }}
            onPress={() => navigate('AddPickerExpense')}
          />
        }
      /> */}
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.total_weight}</Text>
          <Text h3 style={{ color: green }}>
            {sumBy(data?.data?.income, o => parseFloat(o.weight))} Kg
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.avg_rate}</Text>
          <Text h3 style={{ color: green }}>
            {currencyFormat(sumBy(data?.data?.income, o => parseFloat(o.weight) * parseFloat(o.rate)) / sumBy(data?.data?.income, o => parseFloat(o.weight)))}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.total_amount}</Text>
          <Text h3 style={{ color: green }}>
            {currencyFormat(sumBy(data?.data?.income, o => parseFloat(o.weight) * parseFloat(o.rate)))}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.given_amount}</Text>
          <Text h3 style={{ color: red }}>
            -- {currencyFormat(sumBy(data?.data?.expense, o => parseFloat(o.amount)))}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.final}</Text>
          <Text h3 style={{
            color: (!isNaN(data?.amount) ? data?.amount : 0) > 0
              ? green
              : red
          }}>
            {(!isNaN(data?.amount) ? data?.amount : 0) > 0 ? '+' : '--'} {currencyFormat(
              (!isNaN(data?.amount) ? data?.amount : 0),
            )}
          </Text>
        </View>
        <View style={styles.wt}>
          <Text h4 style={styles.underline}>
            {strings.picker_record}
          </Text>
          {Array.isArray(data?.data?.income) && data?.data?.income.length && !data?.data?.income.every(o => o?.weight == '0' || !o?.weight) && data?.picker ? (
            sortBy(data.data.income, (a, b) => moment(b?.date) - moment(a?.date)).map(
              (v, i) => (
                <PickerDetailAction
                  key={i}
                  data={v}
                  totalExpense={data?.data?.expense.length}
                  totalPicker={data?.total}
                />
              ),
            )
          ) : (
            <Text>No Record</Text>
          )}
        </View>
        <View style={styles.wt}>
          <Text h4 style={styles.underline}>
            {strings.amount}
          </Text>
          {Array.isArray(data?.data?.expense) && data?.data?.expense.length && data?.picker ? (
            sortBy(data?.data?.expense, (a, b) => moment(b?.date) - moment(a?.date)).map(
              (v, i) => (
                <PickerExpenseDetail
                  key={i}
                  data={v}
                  onPress={async () => {
                    if (
                      !data?.total &&
                      Array.isArray(data?.data?.income) &&
                      data?.data?.income.length &&
                      data?.data?.expense.length == 1
                    )
                      await deletePicker(data?.data?.income[0]?.id);
                  }}
                />
              ),
            )
          ) : (
            <Text>No Record</Text>
          )}
        </View>
      </ScrollView>
    </BaseView>
  );
}
const styles = StyleSheet.create({
  list: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: white,
    padding: 10,
    marginVertical: 10,
    width: '98%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
  underline: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderStyle: 'dotted',
  },
  wt: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    elevation: 1,
    width: 30,
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 5,
  },
});
