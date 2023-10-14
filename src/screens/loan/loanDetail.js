import React, {useCallback, useEffect, useState} from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Modal,
  PixelRatio,
  TouchableOpacity,
  View,
} from 'react-native';
import {green, red, white} from 'src/utils/color';
import moment from 'moment';
import {sortBy, groupBy, sumBy} from 'lodash';
import {
  useFocusEffect,
  useIsFocused,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {strings} from 'src/translations/locale';
import Button from 'src/components/button';
import GiverDetailAction from 'src/components/giverDetailAction';
import Header from '../../components/header';
import Icon from '../../components/icon';
import {goBack} from '../../navigation/ref';
import {currencyFormat} from '../../utils/dateformat';
import {ToastError, ToastProgress} from '../../utils/toast';
import Loader from 'src/components/loader';
import {dateFormat} from 'src/utils/dateformat';
import {navigate, replace} from 'src/navigation/ref';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {useAuth} from '../../context/authContext';
import {useLang} from 'src/context/langContext';

import {deleteLoanCollection} from '../../network/loan-service';

import {
  aqua,
  blue,
  cyan,
  gray1,
  gray11,
  gray2,
  gray3,
  gray4,
  greenDark,
  greenLight,
  lightBlue,
  lightGreen,
  lightOrange,
  lightRed,
  lightYellow,
  parrot,
  peach,
  pink,
  purple,
  redLight,
  skyBlue,
  yellowLight,
} from '../../utils/color';
import Share from 'react-native-share';
import {useLoan} from '../../context/loanContext';
import {getLoanData} from '../../network/loan-service';
import LoanDetailAction from '../../components/loanDetailAction';
import auth from '@react-native-firebase/auth';
import {getTotalInterst} from '../../utils/helper';

const transparent = 'rgba(0,0,0,0.5)';

export default function LoanDetail() {
  const {user} = useAuth();
  const {params} = useRoute();
  const data = params?.item ?? {};
  const [loading, setLoading] = useState(false);
  const {loanData = [], getLoan} = useLoan();
  const isFocused = useIsFocused();
  const personName = data?.name;

  const {amount, interest_rate} = data;

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
  const finalAmount = givenAmountWithInterest - takenAmountWithInterest;

  let givenAmount = 0;
  let takenAmount = 0;
  groupedData.forEach(entry => {
    if (entry.giver === auth().currentUser.uid) {
      takenAmount += parseInt(entry.amount);
    } else if (entry.receiver === auth().currentUser.uid) {
      givenAmount += parseInt(entry.amount);
    }
  });
  const givenInterest = (givenAmount * interest_rate) / 100;
  const takenInterest = (takenAmount * interest_rate) / 100;
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
                btnStyle={{width: '40%', backgroundColor: red}}
                size={30}
                style={{color: red, display: __DEV__ ? 'flex' : 'none'}}
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
                btnStyle={{width: '40%', backgroundColor: gray4}}
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
//       return `<tr>
//     <td>${dateFormat(record?.date)}</td>
//     <td>${days}</td> 
//     <td>${currencyFormat(parseFloat(interest))}</td>  
//         <td>${givenAmount}</td>
//     <td>${takenAmount}</td>
//     <td>${currencyFormat(final_amount)}
//     </td>
//     <td>${record?.detail}</td>
//       </tr>`;
//     },
//   )}
//   </table>
  
        let date = moment(record?.date).format('YYYY-MM-DD');
        let start_date = moment(date);
        let today = moment();
        let days = today.diff(start_date, 'days');
        let interest = (
          ((parseFloat(record?.amount) * (parseFloat(record?.interest_rate) / 100)) / 30) *
          parseInt(days)
        ).toFixed(2);

        return `<tr>
              <td>${dateFormat(record.date)}</td>
              <td>${days}</td> 
               <td>${currencyFormat(record?.interest_rate)}</td>
               <td>${currencyFormat(record?.amount)}</td>
               <td>${currencyFormat(interest)}</td>
              <td>${currencyFormat(
          parseFloat(interest) + parseFloat(record?.amount)
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
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="back"
              size={28}
              color={white}
              onPress={() => goBack()}
            />
          </View>
        }
        centerComponent={
          <Text h2 style={{color: white,fontWeight:"bold"}}>
            {data?.name}
          </Text>
        }
        rightComponent={
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="edit"
              size={25}
              style={{ color: white, marginRight: 10 }}
              onPress={() => replace('AddLoan', { data })}
            />
            <Icon
              name="pdffile1"
              size={25}
              color={white}
              style={{
                marginRight: 15,
              }}
              onPress={onShare}
              // onPress={() => {
              //   ToastProgress(strings.in_progress)
              // }}
            />

            <TouchableOpacity
              onPress={() => {
                setopenModal(true);
                // ToastProgress(strings.in_progress)
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

      <View style={[styles.row]}>
        {/* <View style={[styles.card, {borderColor: greenLight}]}>
          <Text h4 style={styles.text}>
            {strings.taken_amount_with_interest}
          </Text>
          <Text h3 style={{color: lightRed}}>
            {currencyFormat(takenAmountWithInterest)}
          </Text>
        </View>
        <View style={[styles.card, {borderColor: peach}]}>
          <Text h4 style={styles.text}>
            {strings.given_amount_with_interest}
          </Text>
          <Text h3 style={{color: green}}>
            {currencyFormat(givenAmountWithInterest)}
          </Text>
        </View> */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={[styles.card, {backgroundColor: gray1}]}>
            <Text h4 style={styles.cardtext}>
              {strings.taken_amount}
            </Text>
            <Text h3 style={{color: greenDark, fontWeight: 'bold'}}>
              {currencyFormat(takenAmount)}
            </Text>
          </View>
          <View style={[styles.card, {backgroundColor: gray1}]}>
            <Text h4 style={styles.cardtext}>
              {strings.given_amount}
            </Text>
            <Text h3 style={{color: lightRed, fontWeight: 'bold'}}>
              {currencyFormat(givenAmount)}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={[styles.card, {backgroundColor: gray1}]}>
            <Text h4 style={styles.cardtext}>
              {strings.total_interest}
            </Text>
            <Text h3 style={{color: greenDark, fontWeight: 'bold'}}>
              {currencyFormat(takenInterest)}
            </Text>
          </View>
          <View style={[styles.card, {backgroundColor: gray1}]}>
            <Text h4 style={styles.cardtext}>
              {strings.total_interest}
            </Text>
            <Text h3 style={{color: lightRed, fontWeight: 'bold'}}>
              {currencyFormat(givenInterest)}
            </Text>
          </View>
        </View>

        <View style={[styles.cardfinal, {backgroundColor: gray1}]}>
          <Text h3>{strings.final}</Text>
          <Text h3>{currencyFormat(finalAmount)}</Text>
        </View>
      </View>
      <View style={styles.wt}>
        <Text h2 style={styles.underline}>
          {strings.loan_record}
        </Text>

        {/* <View style={styles.row}> */}
        {/* <Text style={{width: '20%', textAlign: 'center'}} h3>
            {strings.date}
          </Text>
          <Text style={{width: '15%', textAlign: 'right'}} h3>
            {strings.day}
          </Text> */}
        {/* <Text style={{width: '28%', textAlign: 'right'}} h3>
            {strings.total_interest}
          </Text> */}
        {/* <Text style={{width: '45%', textAlign: 'right'}} h3>
            {strings.total_amount}
          </Text> */}
      </View>
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{paddingBottom: '100%'}}
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
    flexWrap: 'wrap',
  },
  wt: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 10,
    // backgroundColor: white,
    // elevation:5
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
  cardfinal: {
    width: '95%',
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'space-between',
    padding: 15,
    elevation: 5,
    marginVertical: 5,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
  },
  underline: {
    width: '100%',
    textAlign: 'center',
    color: green,
    fontWeight: 'bold',
    backgroundColor: gray2,
    // elevation:5,
    padding: 5,
  },
  text: {
    width: '50%',
  },
  cardtext: {
    width: '80%',
    textAlign: 'center',
  },
});
// style={{color: finalAmount >= 0 ? green : red}}
