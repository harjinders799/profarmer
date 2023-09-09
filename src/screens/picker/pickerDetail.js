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
import { ToastError, ToastProgress } from '../../utils/toast';
import {
  deletePicker,
  deletePickerCollection,
  getPickerExpense,
} from '../../network/picker-service';
import { ScrollView } from 'react-native-gesture-handler';
import Strings from 'react-native-localization';
import {
  green,
  darkOrange,
  red,
  yellow,
  blue,
  greenDark,
} from '../../utils/color';
import { currencyFormat } from '../../utils/dateformat';
import PickerDetailAction from '../../container/picker/pickerDetailAction';
import PickerExpenseDetail from '../../container/picker/pickerExpenseDetail';
import { navigate } from '../../navigation/ref';
import Button from '../../components/button';
import { mean, sortBy, sumBy } from 'lodash';
import moment from 'moment';
import { useCotton } from '../../context/cottonContext';
import { deletePickerNameWise } from '../../sql';
import auth from '@react-native-firebase/auth';

export default function PickerDetail({ navigation }) {
  const { params } = useRoute();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const data = params?.item ?? [];
  const { db, pickerWeight, pickerExpense, getPickerWeight, getPickerExpense } =
    useCotton();
  let pickerData = pickerWeight.filter(o => data?.picker === o.picker);
  let pickerExpenseData = pickerExpense.filter(o => data?.picker === o.picker);

  useFocusEffect(
    useCallback(() => {
      getPickerWeight();
      getPickerExpense();
    }, []),
  );
  let amount =
    sumBy(pickerData, o => parseFloat(o.weight) * parseFloat(o?.rate)) -
    sumBy(pickerExpenseData, o => parseFloat(o.amount));
  return (
    <BaseView style={{ paddingHorizontal: 0 }}>
      <Loader visible={loading} />
      <Header
        style={styles.header}
        leftComponent={
          <View style={{ flexDirection: 'row' }}>
            <Icon
              name="back"
              size={28}
              style={{ color: white, marginRight: 5 }}
              onPress={() => goBack()}
            />
            {/* <Icon
              name="user-circle"
              size={28}
              style={{ color: white }}
              onPress={() => goBack()}
              type="FontAwesome"
            /> */}
          </View>
        }
        centerComponent={
          <Text h2 numberOfLines={1} style={{ width: '50%', color: white }}>
            {data?.picker}
          </Text>
        }
        rightComponent={
          <View style={{ flexDirection: 'row' }}>
            <Icon
              name="search1"
              color={white}
              size={25}
              style={{ marginRight: 15 }}
              onPress={() => ToastProgress(strings.in_progress)}
            />
            <Icon
              name="pdffile1"
              size={25}
              color={white}
              style={{ marginRight: 15 }}
              onPress={() => ToastProgress(strings.in_progress)}
            />
            <Icon
              name="delete"
              size={30}
              style={{ color: red, display: __DEV__ ? 'flex' : 'none' }}
              onPress={async () => {
                await deletePickerNameWise(db, {
                  ...data,
                  uid: auth().currentUser?.uid,
                });
                await deletePickerCollection(data?.picker);
                getPickerWeight();
                getPickerExpense();
              }}
              type="MaterialCommunityIcons"
            />
          </View>
          //    <Icon
          //   name="delete"
          //   size={20}
          //   color={red}
          //   style={[styles.icon, {backgroundColor: colors.card}]}
          //   onPress={delteData}
          // />
        }
      />
      {/* <Header
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
      /> */}

      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.row]}>
          {/* <View style={{ width: '45%' }}> */}
          <View style={[styles.card, { backgroundColor: '#bbdffc' }]}>
            <Text h2 style={{ fontWeight: 'bold' }}>
              {sumBy(pickerData, o => parseFloat(o.weight))} Kg
            </Text>
            <Text h3>{strings.total_weight}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#ffccaa' }]}>
            <Text h2 style={{ fontWeight: 'bold' }}>
              {currencyFormat(
                sumBy(
                  pickerData,
                  o => parseFloat(o.weight) * parseFloat(o.rate),
                ),
              )}
            </Text>
            <Text h3>{strings.total_amount}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#bee8ba' }]}>
            <Text h2 style={{ fontWeight: 'bold' }}>
              -{' '}
              {currencyFormat(
                sumBy(pickerExpenseData, o => parseFloat(o.amount)),
              )}
            </Text>
            <Text h3>{strings.given_amount}</Text>
          </View>
          {/* </View> */}
          {/* <View style={{ width: '45%', justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
            <Text h3>{'Baki dene hai '}</Text> */}
          <View style={[styles.card, { backgroundColor: '#e5e5e5' }]}>
            <Text
              h2
              style={{
                fontWeight: 'bold',
                color: (!isNaN(amount) ? amount : 0) > 0 ? greenDark : red,
              }}>
              {(!isNaN(amount) ? amount : 0) > 0 ? '+' : ''}
              {currencyFormat(!isNaN(amount) ? amount : 0)}
            </Text>
            <Text h3>{strings.final}</Text>
          </View>
          {/* </View> */}
        </View>

        <View style={styles.wt}>
          <Text h4 style={styles.underline}>
            {strings.picker_record}
          </Text>
          {Array.isArray(pickerData) &&
            pickerData.length &&
            !pickerData.every(o => o?.weight == '0' || !o?.weight) &&
            data?.picker ? (
            sortBy(pickerData, (a, b) => moment(b?.date) - moment(a?.date)).map(
              (v, i) => <PickerDetailAction key={i} data={v} />,
            )
          ) : (
            <Text h4 style={styles.underline}>
              {strings.no_record}
            </Text>
          )}
        </View>
        <View style={styles.wt}>
          <Text h4 style={styles.underline}>
            {strings.amount}
          </Text>
          {Array.isArray(pickerExpenseData) &&
            pickerExpenseData.length &&
            data?.picker ? (
            sortBy(
              pickerExpenseData,
              (a, b) => moment(b?.date) - moment(a?.date),
            ).map((v, i) => (
              <PickerExpenseDetail
                key={i}
                data={v}
              // onPress={async () => {
              //   if (
              //     !data?.total &&
              //     Array.isArray(pickerData) &&
              //     pickerData.length &&
              //     pickerExpenseData.length == 1
              //   )
              //     await deletePicker(pickerData[0]?.id);
              // }}
              />
            ))
          ) : (
            <Text>{strings.no_record}</Text>
          )}
        </View>
      </ScrollView>
      <Header
        style={{ paddingHorizontal: 20 }}
        leftComponent={
          <Button
            label={strings.add_weight}
            btnStyle={{ width: '40%' }}
            onPress={() =>
              navigate('AddPickerWeight', {
                data: {
                  picker: data?.picker,
                  rate: pickerData[pickerData.length - 1]?.rate,
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
  header: {
    backgroundColor: green,
    paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 15,
  },
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
    flexWrap: 'wrap',
    // elevation: 5
  },
  card: {
    elevation: 5,
    backgroundColor: white,
    width: '48%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  underline: {
    // borderBottomWidth: 1,
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
