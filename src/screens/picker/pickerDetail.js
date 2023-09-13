import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import { white } from 'src/utils/color';
import { useFocusEffect, useRoute, useTheme } from '@react-navigation/native';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { goBack } from '../../navigation/ref';
import Loader from 'src/components/loader';
import { strings } from 'src/translations/locale';
import { ToastError } from '../../utils/toast';
import { deletePickerCollection } from '../../network/picker-service';
import { ScrollView } from 'react-native-gesture-handler';
import { green, red, greenDark, gray4 } from '../../utils/color';
import { currencyFormat, dateFormat } from '../../utils/dateformat';
import PickerDetailAction from '../../container/picker/pickerDetailAction';
import PickerExpenseDetail from '../../container/picker/pickerExpenseDetail';
import { navigate } from '../../navigation/ref';
import Button from '../../components/button';
import Input from 'src/components/input';
import { sortBy, sumBy } from 'lodash';
import moment from 'moment';
import { useCotton } from '../../context/cottonContext';
import { deletePickerNameWise } from '../../sql';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useAuth } from '../../context/authContext';
import Share from 'react-native-share';

const transparent = 'rgba(0,0,0,0.5)';

export default function PickerDetail({ navigation }) {
  const { params } = useRoute();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const data = params?.item ?? [];
  const [rate, setRate] = useState();
  const {
    db,
    pickerWeight = [],
    pickerExpense,
    getPickerWeight,
    getPickerExpense,
  } = useCotton();

  let pickerData = pickerWeight.filter(o => data?.picker === o.picker);
  let pickerExpenseData = pickerExpense.filter(o => data?.picker === o.picker);

  useFocusEffect(
    useCallback(() => {
      getPickerWeight();
      getPickerExpense();
      let baseRate = pickerData[pickerData.length - 1].rate;
      let pRate = pickerData.every(o => baseRate == o.rate || o.weight == '0');
      if (pRate) setRate(baseRate);
    }, []),
  );

  let amount =
    sumBy(
      pickerData,
      o =>
        parseFloat(o.weight) * (rate ? parseFloat(rate) : parseFloat(o.rate)),
    ) - sumBy(pickerExpenseData, o => parseFloat(o.amount));

  const [openModal, setopenModal] = useState(false);

  function renderModal() {
    return (
      <Modal visible={openModal} animationType="slide" transparent={true}>
        <View style={styles.modal}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              width: '90%',
              borderRadius: 10,
              // height:110,
            }}>
            <Text
              h2
              style={{
                fontWeight: '700',
              }}>
              {strings.are_you_sure}
            </Text>
            <Text
              h3
              style={{
                marginTop: 10,
              }}>
              <Text
                h2
                style={{
                  fontWeight: '700',
                  color: red,
                }}>
                {data?.picker}
              </Text>
              {strings.alert}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Loader visible={loading} />
              <Button
                label={strings.delete}
                btnStyle={{ width: '40%', backgroundColor: red }}
                size={30}
                style={{ color: red, display: __DEV__ ? 'flex' : 'none' }}
                onPress={async () => {
                  try {
                    setLoading(true);
                    setopenModal(false);
                    await deletePickerNameWise(db, {
                      ...data,
                      uid: auth().currentUser?.uid,
                    });
                    await deletePickerCollection(data?.picker);
                    getPickerWeight();
                    getPickerExpense();
                    setLoading(false);
                    goBack();
                  } catch (error) {
                    setLoading(false);
                    ToastError(error?.message);
                  }
                }}
              // type="MaterialCommunityIcons"
              />
              <Button
                label={strings.cancel}
                btnStyle={{ width: '40%', backgroundColor: gray4 }}
                size={30}
                onPress={() => setopenModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  const onShare = async () => {
    if (!user?.name) {
      ToastError('Please Complete your profile');
      navigate('EditProfile');
      return;
    }
    let html = `<!DOCTYPE html>
<html>
<head>
<style>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding:10px;
}
td {
  text-align: center;
}
</style>
</head>
<body>
      <div style="display: flex; flex-direction:column; align-items:center">
          <div style="display: flex; justify-content: space-between; width:100%">
          <div>    
          <h2>Farmer Name: ${user?.name}</h2>
          <p>${user?.phone}</p>
          <p>${user?.email}</p>
          </div>
          <div>
          <a href="https://play.google.com/store/apps/details?id=com.profarmer">Pro Farmer</a>
              <p>Time: ${moment().format('lll')}</p>
          </div>
          </div>
          <h2>Picker Name: ${data?.picker}</h2>
      </div>
      <div style="display: flex; justify-content: space-between;">
          <div>
              <h3>Total Weight: ${sumBy(pickerData, o =>
      parseFloat(o.weight),
    )} Kg</h3>
    <h3>Given Amount: ${currencyFormat(
      sumBy(pickerExpenseData, o => parseFloat(o.amount)),
    )}</h3>
      </div>
      <div>
      <h3>Total Amount (Weight x Rate):  ${currencyFormat(
      sumBy(
        pickerData,
        o =>
          parseFloat(o.weight) *
          (rate ? parseFloat(rate) : parseFloat(o.rate)),
      ),
    )}</h3>
              <h3>Final Amount: ${currencyFormat(
      !isNaN(amount) ? amount : 0,
    )}</h3>
          </div>
      </div>


      <h2>Pickers Weight</h2>
      <table style="width:100%">
          <tr>
              <th style="width:15%">Date</th>
              <th style="width:15%">Picker</th>
              <th style="width:10%">Rate</th>
              <th style="width:10%">Weight</th>
              <th style="width:15%">Amount</th>
              <th style="width:30%">Remark</th>
          </tr>
         ${pickerData.map(record =>
      record?.weight == '0'
        ? null
        : `<tr>
              <td style="width:15%">${dateFormat(record?.date)}</td>
              <td style="width:15%">${record?.picker}</td>
              <td style="width:10%">${currencyFormat(
          rate ? parseFloat(rate) : record?.rate,
        )}</td>
              <td style="width:10%">${record?.weight}Kg</td>
              <td style="width:15%">${currencyFormat(
          (rate ? parseFloat(rate) : record?.rate) * record?.weight,
        )}</td>
              <td style="width:30%">${record?.detail}</td>
          </tr>`,
    )}
      </table>

      <h2>Pickers Amounts</h2>
      <table style="width:100%">
          <tr>
              <th id="date">Date</th>
              <th>Picker</th>
              <th>Amount</th>
              <th>Remark</th>
          </tr>
          ${pickerExpenseData.map(
      amount =>
        `<tr>
              <td id="date">${dateFormat(amount?.date)}</td>
              <td>${amount?.picker}</td>
              <td>${currencyFormat(amount?.amount)}</td>
              <td>${amount?.detail}</td>
          </tr>`,
    )}
      </table>
  </body>
</html>
  `;

    const options = {
      html: html,
      base64: true,
      fileName: data?.picker,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    Share.open({
      url: `data:application/pdf;base64,${file?.base64}`,
      type: 'application/pdf',
      title: data?.picker,
      saveToFiles: true,
      showAppsToView: true,
      filename: data?.picker,
    })
      .then(res => console.log(res, '---res'))
      .catch(err => console.log(err, '----err'));
  };

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
            {/* <Icon
              name="search1"
              color={white}
              size={25}
              style={{ marginRight: 15 }}
              onPress={() => ToastProgress(strings.in_progress)}
            /> */}
            <Icon
              name="pdffile1"
              size={25}
              color={white}
              style={{
                marginRight: 15,
                display: pickerData.length > 1 ? 'flex' : 'none',
              }}
              onPress={onShare}
            />

            <TouchableOpacity
              onPress={() => {
                setopenModal(true);
              }}>
              <Icon
                name="delete"
                size={30}
                color={white}
                type="MaterialCommunityIcons"
              />
            </TouchableOpacity>
            {renderModal()}
          </View>
        }
      />

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
                  o =>
                    parseFloat(o.weight) * (rate ? rate : parseFloat(o.rate)),
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
          {pickerData.length > 1 ? (
            <>
              <Text h4 style={styles.discription}>
                {strings.discription}
              </Text>
              <View style={styles.input}>
                <Input
                  placeholder={strings.enter_rate + '(Rs)'}
                  value={rate}
                  setValue={v => {
                    if (!isNaN(v)) setRate(v);
                  }}
                  style={{ width: '50%', height: 40, marginTop: 10 }}
                  inputStyle={{ padding: 5 }}
                  keyboardType="numeric"
                />
                <Button
                  label={strings.apply}
                  btnStyle={{ width: '30%' }}
                  size={30}
                />
                {/* <Button
              label={strings.undo}
              btnStyle={{ width: '30%' }}
              size={30}
              // onPress={() => setopenModal(false)}
            /> */}
              </View>
            </>
          ) : null}
        </View>

        <View style={styles.wt}>
          <Text h3 style={styles.underline}>
            {strings.picker_record}
          </Text>
          {Array.isArray(pickerData) &&
            pickerData.length &&
            !pickerData.every(o => o?.weight == '0' || !o?.weight) &&
            data?.picker ? (
            sortBy(pickerData, (a, b) => moment(b?.date) - moment(a?.date)).map(
              (v, i) => <PickerDetailAction key={i} data={v} rate={rate} />,
            )
          ) : (
            <Text h4 style={styles.underline}>
              {strings.no_record}
            </Text>
          )}
        </View>
        <View style={styles.wt}>
          <Text h3 style={styles.underline}>
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
  discription: {
    marginTop: 15,
    width: '100%',
  },
  input: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    height: 60,
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
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
  },
});
