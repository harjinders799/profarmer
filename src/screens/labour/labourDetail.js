import { View, StyleSheet, TouchableOpacity, Modal,ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
// import { FlatList, Modal, ScrollView, Share, StyleSheet, View } from 'react-native';
import { green, red, white, gray4, greenDark } from '../../utils/color';
import moment from 'moment';
import { sortBy, sumBy } from 'lodash';
import { useRoute, useTheme } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import { commonStyle } from 'src/utils/style';
import LabourDetailAction from '../../container/labour/labourDetailAction';
import {
  deleteLabour,
  deleteLabourCollection,
  getLabourExpense,
  getLabourLeave,
} from '../../network/labour-service';
import { ToastError } from '../../utils/toast';
import LabourExpenseDetail from '../../container/labour/labourExpenseDetail';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { goBack, navigate } from '../../navigation/ref';
import Button from '../../components/button';
import { currencyFormat, dateFormat } from '../../utils/dateformat';
import RNFS from 'react-native-fs'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useAuth } from '../../context/authContext';
import Share from 'react-native-share';
import auth from '@react-native-firebase/auth';



const transparent = 'rgba(0,0,0,0.5)';

export default function LabourDetail({ navigation }) {
  const { params } = useRoute();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const data = params?.item ?? [];
  const [totalLabour, setTotalLabour] = useState(0);
  const [expense, setExpense] = useState([]);
  

  useEffect(() => {
    getExpense();
  }, [data]);

  const getExpense = async () => {
    try {
      setLoading(true);
      let res = await getLabourExpense(data?.labour);
      setExpense(res);
      setLoading(false);
      let html = '<h1>My Firestore Data</h1>';
      html += '<ul>';

      res.forEach(item => {
        html += `<li>${item.amount}: ${item.date}</li>`;
      });

      html += '</ul>';
      const options = {
        html: html,
        fileName: 'my-pdf',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);

      const pdfPath = `${RNFS.DocumentDirectoryPath}/users.pdf`;
      // await RNFS.writeFile(pdfPath, pdfBytes, 'binary');

    } catch (error) {
      ToastError(error?.message, 'Labour');
      setLoading(false);
    }
  };
  useEffect(() => {
    if (Array.isArray(data.data) && data.data.length) {
      let tot = 0;
      data.data.map(v => {
        tot += parseFloat(v?.count) * parseFloat(v?.rate);
      });
      setTotalLabour(tot);
    }
  }, [data]);
  const {
    db,

  } = useState();


  let expenseTot =
    Array.isArray(expense) && expense.length
      ? sumBy(expense, o => parseFloat(o?.amount))
      : 0;

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
                    {data?.labour}
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
                        await deleteLabourCollection(data?.labour);
                        setLoading(false);
                        goBack();
                      } catch (error) {
                        setLoading(false);
                        ToastError(error?.message);
                      }
                    }}
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
              <h2>${strings.farmer_name}: ${user?.name}</h2>
              <p>${user?.phone}</p>
              <p>${user?.email}</p>
              </div>
              <div>
              <a href="https://play.google.com/store/apps/details?id=com.profarmer">Pro Farmer</a>
                  <p>${moment().format('lll')}</p>
              </div>
              </div>
              <h2>${strings.labour_name}: ${data?.labour}</h2>
          </div>
          <div style="display: flex; justify-content: space-between;">
              <div>
                  <h3>${strings.total_labour}: ${data?.total}</h3>
        <h3>${strings.given_amount}: ${currencyFormat(expenseTot
        )}</h3>
          </div>
          <div>
          <h3>${strings.total_labour_amount} ${strings.labour}*${strings.labour_rate}:=  ${currencyFormat(totalLabour
        )}</h3>
                  <h3>${strings.final}: ${currencyFormat(totalLabour - expenseTot
        )}</h3>
              </div>
          </div>
    
    
          <h2>${strings.labour}</h2>
          <table style="width:100%">
              <tr>
                  <th style="width:15%">${strings.date}</th>
                  <th style="width:15%">${strings.labour}</th>
                  <th style="width:10%">${strings.labour_rate}</th>
                  <th style="width:10%">${strings.total_labour}</th>
                  <th style="width:15%">${strings.amount}</th>
                  <th style="width:30%">${strings.remark}</th>
              </tr>
             ${data.data.map(v => 
              v?.data
            ? null
            : `<tr>
                  <td style="width:15%">${dateFormat(data?.date)}</td>
                  <td style="width:15%">${data?.labour}</td>
                  <td style="width:10%">${v?.count}
            </td>
                  <td style="width:10%">${currencyFormat(v?.rate)}</td>
                  <td style="width:15%">${currencyFormat(parseFloat(v?.rate) * parseFloat(v?.count))}
            </td>
                  <td style="width:30%">${v?.detail}</td>
              </tr>`,
        )}
          </table>
    
          <h2>${strings.labour_amount}</h2>
          <table style="width:100%">
              <tr>
                  <th id="date">${strings.date}</th>
                  <th>${strings.labour}</th>
                  <th>${strings.amount}</th>
                  <th>${strings.remark}</th>
              </tr>
              ${expense.map(
          amount =>
            `<tr>
                  <td id="date">${dateFormat(amount?.date)}</td>
                  <td>${amount?.labour}</td>
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
          fileName: data?.labour,
          directory: 'Documents',
        };
    
        const file = await RNHTMLtoPDF.convert(options);
        Share.open({
          url: `data:application/pdf;base64,${file?.base64}`,
          type: 'application/pdf',
          title: data?.labour,
          saveToFiles: true,
          showAppsToView: true,
          filename: data?.labour,
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
          </View>
        }
        centerComponent={
          <Text h2 numberOfLines={1} style={{ width: '50%', color: white }}>
            {data?.labour}
          </Text>
        }
        rightComponent={
          <View style={{ flexDirection: 'row' }}>
            <Icon
              name="pdffile1"
              size={25}
              color={white}
              style={{
                marginRight: 15,
                // display: labourData.length > 1 ? 'flex' : 'none',
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
          <View style={[styles.card, { backgroundColor: '#bbdffc' }]}>
            {/* <Text h3 style={{ color: green }}> */}
            <Text h2 style={{ fontWeight: 'bold' }}>
              {data?.total}
            </Text>
            <Text h3>{strings.total_labour}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#ffccaa' }]}>
            {/* <Text h3 style={{ color: green }}> */}
            <Text h2 style={{ fontWeight: 'bold' }}>
              {currencyFormat(totalLabour)}
            </Text>
            <Text h3>{strings.labour_amount}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#bee8ba' }]}>
            {/* <Text h3>{strings.given_amount}</Text> */}
            {/* <Text h3 style={{ color: red }}> */}
            <Text h2 style={{ fontWeight: 'bold' }}>
            -{' '}
              {currencyFormat(expenseTot)}
            </Text>
            <Text h3>{strings.given_amount}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#e5e5e5' }]}>
            <Text h2 style={{ fontWeight: 'bold', 
            color: totalLabour - expenseTot > 0 ? greenDark : red }}>
              {(!isNaN(totalLabour) ? -expenseTot : 0) > 0 ? '+' : ''}
              {currencyFormat(totalLabour - expenseTot)}
            </Text>
            <Text h3>{strings.final}</Text>
          </View>
        </View> 
          <View style={styles.wt}>
            <Text h3 style={styles.underline}>
              {strings.labour_record}
            </Text>
            {Array.isArray(data.data) && data.data.length && data?.total ? (
              sortBy(data.data, (a, b) => moment(b?.date) - moment(a?.date)).map(
                (v, i) => (
                  <LabourDetailAction
                    key={i}
                    data={v}
                    totalExpense={expense.length}
                    totalLabour={data?.total}
                  />
                ),
              )
            ) : (
              <Text h4 style={styles.underline}>
                {strings.no_record}</Text>
            )}
          </View>
          <View style={styles.wt}>
            <Text h3 style={styles.underline}>
              {strings.amount}
            </Text>
            {Array.isArray(expense) && expense.length ? (
              sortBy(expense, (a, b) => moment(b?.date) - moment(a?.date)).map(
                (v, i) => (
                  <LabourExpenseDetail
                    key={i}
                    data={v}
                    onPress={async () => {
                      if (
                        !data?.total &&
                        Array.isArray(data.data) &&
                        data.data.length &&
                        expense.length == 1
                      )
                        await deleteLabour(data?.data[0]?.id);
                    }}
                  />
                ),
              )
            ) : (
              <Text>{strings.no_record}</Text>
            )}
          </View>
      </ScrollView>
      <Header
        style={{ paddingHorizontal: 20 }}
        leftComponent={
          <Button
            label={strings.add_labour}
            btnStyle={{ width: '40%' }}
            onPress={() =>
              navigate('AddLabour', {
                data:
                  Array.isArray(data?.data) && data?.data.length
                    ? { ...data, ...data?.data[0] }
                    : data,
              })
            }
          />
        }
        rightComponent={
          <Button
            label={strings.add_expense}
            btnStyle={{ width: '40%' }}
            onPress={() =>
              navigate('AddLabourExpense', { data: { labour: data?.labour } })
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
  header: {
    backgroundColor: green,
    paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
    flexWrap: 'wrap',
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
