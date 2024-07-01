import React, { useCallback, useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import {
  ScrollView,
  StyleSheet,
  Modal,
  PixelRatio,
  TouchableOpacity,
  View,
} from 'react-native';
import { green, red, white } from 'src/utils/colors';
import moment from 'moment';
import { sortBy, groupBy, sumBy } from 'lodash';
import {
  useFocusEffect,
  useIsFocused,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import Button from 'src/components/button';
import GiverDetailAction from 'src/components/giverDetailAction';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { goBack } from '../../navigation/ref';
import { currencyFormat } from '../../utils/dateformat';
import { ToastError, ToastProgress } from '../../utils/toast';
import Loader from 'src/components/loader';
import { dateFormat } from 'src/utils/dateformat';
import { navigate, replace } from 'src/navigation/ref';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useAuth } from '../../context/authContext';
import { useLang } from 'src/context/langContext';

import { deleteLoanCollection } from '../../network/loan-service';

import {
  gray2,
  gray3,
  gray4,
  greenDark,
} from '../../utils/colors';
import Share from 'react-native-share';
import { useLoan } from '../../context/loanContext';
import LoanDetailAction from '../../components/loanDetailAction';
import auth from '@react-native-firebase/auth';
import { getTotalInterst } from '../../utils/helper';

const transparent = 'rgba(0,0,0,0.5)';

export default function LoanDetail() {
  const { user } = useAuth();
  const { params } = useRoute();
  const data = params?.item ?? {};
  const [loading, setLoading] = useState(false);
  const { loanData = [], getLoan } = useLoan();
  const isFocused = useIsFocused();
  const personName = data?.name;
  const [showDetails, setShowDetails] = useState(false);

  const { amount, interest_rate } = data;

  useFocusEffect(
    useCallback(() => {
      getLoan();
    }, [isFocused]),
  );

  const groupedData = loanData.filter(entry => {
    return (
      (entry.giver === personName &&
        entry?.receiver == auth().currentUser.uid) ||
      (entry.receiver === personName && entry?.giver == auth().currentUser.uid)
    );
  });
  const givenAmountWithInterest = getTotalInterst(
    groupedData.filter(entry => entry.giver === auth().currentUser.uid),
  );

  const takenAmountWithInterest = getTotalInterst(
    groupedData.filter(entry => entry.giver === personName),
  );
  const finalAmount = takenAmountWithInterest - givenAmountWithInterest;

  let givenAmount = 0;
  let takenAmount = 0;
  let takenAmountInterest = 0;
  let givenAmountInterest = 0;
  let today = moment();
  groupedData.forEach(entry => {
    let date = moment(entry?.date).format('YYYY-MM-DD');
    let start_date = moment(date);
    let days = today.diff(start_date, 'days');
    let interest = (
      ((parseFloat(entry.amount) * (parseFloat(entry.interest_rate) / 100)) / 30) *
      parseInt(days)
    );
    if (entry.giver === auth().currentUser.uid) {
      takenAmount += parseInt(entry.amount);
      takenAmountInterest += interest;
    } else if (entry.receiver === auth().currentUser.uid) {
      givenAmount += parseInt(entry.amount);
      givenAmountInterest += interest
    }
  });
  const givenInterest = givenAmountInterest;
  const takenInterest = takenAmountInterest;
  // const finalAmount = givenAmount - takenAmount;

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
                {data?.name}
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
                    await deleteLoanCollection(data?.name);
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
          <h2>${strings.giver + ' / ' + strings.receiver}: ${data?.name}</h2>
      </div>
      <div style="display: flex; justify-content: space-between;">
          <div>
              <h3>${strings.taken_amount_with_interest}: ${currencyFormat(
      takenAmountWithInterest,
    )}
    </h3>
    
      </div>
      <div>
      <h3>${strings.given_amount_with_interest}: ${currencyFormat(
      givenAmountWithInterest,
    )} </h3>
          </div>
      </div>
      <div style="display: flex; justify-content: space-between;">
         <div>
      <h3>${strings.total_amount}  : ${currencyFormat(finalAmount)}</h3>
        </div>
        <div>
        <h3>${strings.interest}: ${currencyFormat(interest_rate)} </h3>
            </div>
        </div>

      <h2>${strings.loan_record}</h2>
      <table style="width:100%">
      <tr>
      <th>${strings.date}</th>
      <th>${strings.day}</th>
      <th>${strings.total_interest}</th>
      <th>${strings.given_amount}</th>
      <th>${strings.taken_amount}</th>
      <th>${strings.total_amount}</th>
      <th>${strings.remark}</th>
  </tr>
  ${sortBy(groupedData, (a, b) => moment(b?.date) - moment(a?.date)).map(
      record => {
        let date = moment(record?.date).format('YYYY-MM-DD');
        let start_date = moment(date);
        let today = moment();
        let days = today.diff(start_date, 'days');
        let interest = (
          ((parseFloat(record?.amount) *
            (parseFloat(record?.interest_rate) / 100)) /
            30) *
          parseInt(days)
        ).toFixed(2);

        return `<tr>
              <td>${dateFormat(record.date)}</td>
              <td>${days}</td> 
               <td>${currencyFormat(record?.interest_rate)}</td>
               <td>${currencyFormat(record?.amount)}</td>
               <td>${currencyFormat(interest)}</td>
              <td>${currencyFormat(
          parseFloat(interest) + parseFloat(record?.amount),
        )}</td>
              <td>${record?.detail}</td>
          </tr>`;
      },
    )}
      </table>
  </body>
</html>
  `;

    const options = {
      html: html,
      base64: true,
      fileName: data?.name,
      directory: 'Documents',
    };
    const file = await RNHTMLtoPDF.convert(options);
    Share.open({
      url: `data:application/pdf;base64,${file?.base64}`,
      type: 'application/pdf',
      title: data?.name,
      saveToFiles: true,
      showAppsToView: true,
      filename: data?.name,
    })
      .then(res => console.log(res, '---res'))
      .catch(err => console.log(err, '----err'));
  };

  return (
    <BaseView>
      <Header
        style={styles.header}
        leftComponent={
          <View style={{ flexDirection: 'row' }}>
            <Icon
              name="back"
              size={28}
              color={white}
              onPress={() => goBack()}
            />
          </View>
        }
        centerComponent={
          <Text h2 style={{ color: white, fontWeight: 'bold' }}>
            {data?.name}
          </Text>
        }
        rightComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name="edit"
              size={25}
              style={{ color: white, marginRight: 15 }}
              onPress={() => replace('AddLoan', { data })}
            />
            <Icon
              name="pdffile1"
              size={22}
              color={white}
              style={{
                marginRight: 15,
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
      <View style={[styles.card, { backgroundColor: red }]}>
        <View style={styles.row}>
          <View style={{ alignItems: 'flex-start', padding: 10 }}>
            <Text h4 style={{ color: white, fontWeight: 'bold' }}>
              {currencyFormat(givenAmount + givenInterest)}
            </Text>
            <Text h5 style={{ color: white }}>
              Given
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={styles.innerCard}>
              <Text h4 style={{ color: white, fontWeight: 'bold' }}>
                {currencyFormat(givenAmount)}
              </Text>
              <Text h6 style={{ color: white }}>
                {strings.taken_amount}
              </Text>
            </View>
            <View
              style={[
                styles.innerCard,
                {
                  marginTop: 5,
                },
              ]}>
              <Text h4 style={{ color: white, fontWeight: 'bold' }}>
                {currencyFormat(givenInterest)}
              </Text>
              <Text h6 style={{ color: white }}>
                {strings.interest}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.card, { backgroundColor: greenDark }]}>
        <View style={styles.row}>
          <View style={{ alignItems: 'flex-start', padding: 10 }}>
            <Text h4 style={{ color: white, fontWeight: 'bold' }}>
              {currencyFormat(takenAmount + takenInterest)}
            </Text>
            <Text h5 style={{ color: white }}>
              Taken
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={styles.innerCard}>
              <Text h4 style={{ color: white, fontWeight: 'bold' }}>
                {currencyFormat(takenAmount)}
              </Text>
              <Text h6 style={{ color: white }}>
                {strings.taken_amount}
              </Text>
            </View>
            <View
              style={[
                styles.innerCard,
                {
                  marginTop: 5,
                },
              ]}>
              <Text h4 style={{ color: white, fontWeight: 'bold' }}>
                {currencyFormat(takenInterest)}
              </Text>
              <Text h6 style={{ color: white }}>
                {strings.interest}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={[
          styles.card,
          {
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
            borderWidth: 5,
            elevation: 0,
            borderColor: gray2,
          },
        ]}>
        <View
          style={[
            styles.row,
            {
              elevation: 100,
              backgroundColor: gray4 + 10,
              marginVertical: 0,
            },
          ]}>
          <Text
            h4
            style={{
              // color: red,
              padding: 10,
              fontWeight: 'bold',
            }}>
            Final Amount
          </Text>
          <Text
            h4
            style={{
              color: finalAmount > 0 ? greenDark : red,
              fontWeight: 'bold',
              padding: 10,
            }}>
            {currencyFormat(finalAmount)}
          </Text>
        </View>
        <Text
          h6
          style={{
            color: finalAmount > 0 ? greenDark : red,
          }}>
          {finalAmount < 0 ? strings.give : strings.receive}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.row,
          {
            paddingVertical: 10,
            borderBottomWidth: showDetails ? 1 : 0,
            borderColor: gray3,
          },
        ]}
        onPress={() => setShowDetails(!showDetails)}>
        <Text h4 style={{}}>
          {/* {strings.loan_record} */}
          View All Transaction
        </Text>
        <Icon name={showDetails ? 'down' : 'right'} color="black" size={20} />
      </TouchableOpacity>

      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{
          paddingBottom: '100%',
          display: showDetails ? 'flex' : 'none',
        }}
        showsVerticalScrollIndicator={false}>
        {Array.isArray(groupedData) && groupedData.length ? (
          sortBy(groupedData, (a, b) => moment(b?.date) - moment(a?.date)).map(
            (v, i) => <LoanDetailAction key={i} data={v} />,
          )
        ) : (
          <Text>0</Text>
        )}
      </ScrollView>
      {/* </View> */}

      <Button
        hitSlop={10}
        label={strings.receive}
        btnStyle={{
          backgroundColor: greenDark,
          width: '40%',
          position: 'absolute',
          bottom: 5,
          left: 30,
          zIndex: 999,
          height: 35 * PixelRatio.getFontScale(),
        }}
        onPress={() =>
          navigate('AddCredit', {
            data: {
              giver: auth().currentUser.uid,
              receiver: data?.name,
              type: 'debt',
              interest_rate: data?.interest_rate,
            },
          })
        }
      />
      <Button
        hitSlop={10}
        label={strings.give}
        btnStyle={{
          backgroundColor: red,
          width: '40%',
          position: 'absolute',
          bottom: 5,
          right: 30,
          zIndex: 999,
          height: 35 * PixelRatio.getFontScale(),
        }}
        onPress={() =>
          navigate('AddCredit', {
            data: {
              receiver: auth().currentUser.uid,
              giver: data?.name,
              type: 'credit',
              interest_rate: data?.interest_rate,
            },
          })
        }
      />
    </BaseView>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: green,
    paddingHorizontal: 25,
    paddingVertical: 15,
    width: '120%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
  card: {
    elevation: 5,
    backgroundColor: white,
    width: '100%',
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
  },
  underline: {
    width: '100%',
  },
  text: {
    width: '50%',
  },
  cardtext: {
    width: '80%',
    textAlign: 'center',
  },
  innerCard: {
    backgroundColor: white + 40,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingLeft: 25,
    paddingRight: 15,
    padding: 10,
    paddingVertical: 5,
  },
});
// style={{color: finalAmount >= 0 ? green : red}}
