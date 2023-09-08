import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import { white } from 'src/utils/color';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { goBack } from '../../navigation/ref';
import Loader from 'src/components/loader';
import { strings } from 'src/translations/locale';
import { ToastError } from '../../utils/toast';
import {
  deletePicker,
  deletePickerCollection,
  getPickerExpense,
} from '../../network/picker-service';
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
import { useCotton } from '../../context/cottonContext';

export default function PickerDetail({ navigation }) {
  const { params } = useRoute();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const data = params?.item ?? [];
  const { pickerWeight, pickerExpense, getPickerWeight, getPickerExpense } =
    useCotton();

  useFocusEffect(
    useCallback(() => {
      getPickerWeight();
      getPickerExpense();
    }, []),
  );

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header
        style={{ marginTop: 10 }}
        leftComponent={<Icon name="back" size={28} onPress={() => goBack()} />}
        centerComponent={<Text h2>{data?.picker}</Text>}
        rightComponent={
          // __DEV__ ? (
          //   <Icon
          //     name={'delete'}
          //     size={20}
          //     onPress={async () => await deletePickerCollection(data?.picker)}
          //   />
          // ) : (
          <Text numberOfLines={1} h4>
            {data?.picker ? strings.picker : ''}
          </Text>
          // )
        }
      />

      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.total_weight}</Text>
          <Text h3 style={{ color: green }}>
            {sumBy(pickerWeight, o => parseFloat(o.weight))} Kg
          </Text>
        </View>
        {/* <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.avg_rate}</Text>
          <Text h3 style={{ color: green }}>
            {currencyFormat(
              sumBy(
                pickerWeight,
                o => parseFloat(o.weight) * parseFloat(o.rate),
              ) /
              sumBy(pickerWeight, o =>
                o.weight != '0' ? parseFloat(o.weight) : 1,
              )
            )}
          </Text>
        </View> */}
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.total_amount}</Text>
          <Text h3 style={{ color: green }}>
            {currencyFormat(
              sumBy(
                pickerWeight,
                o => parseFloat(o.weight) * parseFloat(o.rate),
              ),
            )}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.given_amount}</Text>
          <Text h3 style={{ color: red }}>
            -- {currencyFormat(sumBy(pickerExpense, o => parseFloat(o.amount)))}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.final}</Text>
          <Text
            h3
            style={{
              color:
                (!isNaN(data?.amount) ? data?.amount : 0) > 0 ? green : red,
            }}>
            {(!isNaN(data?.amount) ? data?.amount : 0) > 0 ? '+' : '--'}{' '}
            {currencyFormat(!isNaN(data?.amount) ? data?.amount : 0)}
          </Text>
        </View>
        <View style={styles.wt}>
          <Text h4 style={styles.underline}>
            {strings.picker_record}
          </Text>
          {Array.isArray(pickerWeight) &&
            pickerWeight.length &&
            !pickerWeight.every(o => o?.weight == '0' || !o?.weight) &&
            data?.picker ? (
            sortBy(
              pickerWeight,
              (a, b) => moment(b?.date) - moment(a?.date),
            ).map((v, i) => <PickerDetailAction key={i} data={v} />)
          ) : (
            <Text>No Record</Text>
          )}
        </View>
        <View style={styles.wt}>
          <Text h4 style={styles.underline}>
            {strings.amount}
          </Text>
          {Array.isArray(pickerExpense) &&
            pickerExpense.length &&
            data?.picker ? (
            sortBy(
              pickerExpense,
              (a, b) => moment(b?.date) - moment(a?.date),
            ).map((v, i) => (
              <PickerExpenseDetail
                key={i}
                data={v}
              // onPress={async () => {
              //   if (
              //     !data?.total &&
              //     Array.isArray(pickerWeight) &&
              //     pickerWeight.length &&
              //     pickerExpense.length == 1
              //   )
              //     await deletePicker(pickerWeight[0]?.id);
              // }}
              />
            ))
          ) : (
            <Text>No Record</Text>
          )}
        </View>
      </ScrollView>
      <Header
        leftComponent={
          <Button
            label={strings.add_weight}
            btnStyle={{ width: '40%' }}
            onPress={() =>
              navigate('AddPickerWeight', {
                data: {
                  picker: data?.picker,
                  rate: pickerWeight[pickerWeight.length - 1]?.rate,
                },
              })
            }
          />
        }
        rightComponent={
          <Button
            label={strings.add_expense}
            btnStyle={{ width: '40%' }}
            onPress={() =>
              navigate('AddPickerExpense', { data: { picker: data?.picker } })
            }
          />
        }
      />
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
