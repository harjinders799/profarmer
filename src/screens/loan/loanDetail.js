import React, {useEffect, useState} from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
import {green, red, white} from 'src/utils/color';
import moment from 'moment';
import {sortBy, groupBy,sumBy} from 'lodash';
import {useRoute, useTheme} from '@react-navigation/native';
import {strings} from 'src/translations/locale';
import Button from 'src/components/button';
import GiverDetailAction from 'src/components/giverDetailAction';
import Header from '../../components/header';
import Icon from '../../components/icon';
import {goBack} from '../../navigation/ref';
import {currencyFormat} from '../../utils/dateformat';
import {ToastError} from '../../utils/toast';
import Loader from 'src/components/loader';
import {dateFormat} from 'src/utils/dateformat';
import {navigate, replace} from 'src/navigation/ref';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {useAuth} from '../../context/authContext';
import {useLang} from 'src/context/langContext';

import {deleteGiverCollection} from '../../network/interest-service';

import {
  gray4,
  greenLight,
  lightBlue,
  lightGreen,
  lightOrange,
  lightRed,
  lightYellow,
  peach,
} from '../../utils/color';
import Share from 'react-native-share';
import {useLoan} from '../../context/loanContext';
import { getLoanData } from '../../network/loan-service';
import LoanDetailAction from '../../components/loanDetailAction';
import auth from '@react-native-firebase/auth';

const transparent = 'rgba(0,0,0,0.5)';

export default function LoanDetail({navigation}) {
  const {user} = useAuth();
  const {params} = useRoute();
  const data = params?.item ?? {};
  const {colors} = useTheme();
  const [interest, setInterest] = useState(0);
  const {lang} = useLang();
  const [loading, setLoading] = useState(false);
  const {loanData = []} = useLoan();


  const personName = data?.name; 

   const groupedData = loanData.filter((entry) => {
    return (
      (entry.giver === personName || entry.receiver === personName) &&
      entry.giver !== entry.receiver
    );
  });

  const givenAmountWithInterest = groupedData
    .filter((entry) => entry.giver === personName)
    .reduce((total, entry) => {
      const interestAmount = (entry.interest_rate * parseFloat(entry.amount)) / 100;
      return total + parseFloat(entry.amount) + interestAmount;
    }, 0);

  const takenAmountWithInterest = groupedData
    .filter((entry) => entry.receiver === personName)
    .reduce((total, entry) => {
      const interestAmount = (entry.interest_rate * parseFloat(entry.amount)) / 100;
      return total + parseFloat(entry.amount) + interestAmount;
    }, 0);

  const finalAmount = givenAmountWithInterest - takenAmountWithInterest;



  useEffect(() => {
    if (Array.isArray(loanData) && loanData.length) {
      let tot_interest = 0;
      loanData.map(v => {
        let date = moment(v?.date).format('YYYY-MM-DD');
        let start_date = moment(date);
        let today = moment();
        let days = today.diff(start_date, 'days');
        let interest = (
          ((parseFloat(v?.amount) * (parseFloat(v?.interest_rate) / 100)) /
            30) *
          parseInt(days)
        ).toFixed(2);
        tot_interest += parseFloat(interest);
      });
      setInterest(tot_interest);
    }
  }, [loanData]);

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
        centerComponent={<Text h2>{data?.name}</Text>}
         rightComponent={
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="pdffile1"
              size={25}
              color={white}
              style={{
                marginRight: 15,
              }}
            />

            <TouchableOpacity
              onPress={() => {
                // setopenModal(true);
              }}>
              <Icon
                name="delete"
                size={30}
                color={white}
                type="MaterialCommunityIcons"
              />
            </TouchableOpacity>
            {/* {renderModal()} */}
          </View>
        }
      />
 
      <View style={[styles.row]}>
        <View style={[styles.card, {borderColor: greenLight}]}>
        <Text h4 style={styles.text}>{strings.taken_amount_with_interest}</Text>
    <Text h3 style={{ color: lightRed }}>
      {currencyFormat(takenAmountWithInterest)}
    </Text>
        </View>
        <View style={[styles.card, {borderColor: peach}]}>
        <Text h4 style={styles.text}>{strings.given_amount_with_interest}</Text>
    <Text h3 style={{ color: green }}>
      {currencyFormat(givenAmountWithInterest)}
    </Text>
        </View> 
        {/* <View style={[styles.card, {borderColor: greenLight}]}>
          <Text h3>{strings.total_interest}</Text>
          <Text h3 style={{color: red}}>
            {currencyFormat(interest)}
          </Text>
        </View> */}
        <View style={[styles.card, {borderColor: lightYellow}]}>
          <Text h3>{strings.total_amount}</Text>
            <Text h3 style={{ color: finalAmount >= 0 ? green : lightRed }}>
      {currencyFormat(finalAmount)}
    </Text>
           </View>
      </View>
      <View style={styles.wt}>
        <Text
          h3
          style={[
            styles.underline,
            {backgroundColor: greenLight, width: '100%', textAlign: 'center'},
          ]}>
          {strings.amount}
        </Text>

        <View style={styles.row}>
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
          style={{width: '100%', height: '40%'}}
          // contentContainerStyle={{paddingBottom: 150}}
          showsVerticalScrollIndicator={false}>
          {Array.isArray(loanData) && loanData.length ? (
            sortBy(loanData, (a, b) => moment(b?.date) - moment(a?.date)).map(
              (v, i) => <LoanDetailAction key={i} data={v} />,
            )
          ) : (
            <Text>0</Text>
          )}
        </ScrollView>
      </View>

      {/* </View> */}
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
  underline: {
    // borderBottomWidth: 1,
    paddingVertical: 10,
    // borderStyle: 'dotted',
  },
  wt: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  card: {
    backgroundColor: white,
    width: '100%',
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'space-between',
    padding: 10,
    elevation: 5,
    marginVertical: 5,
    borderWidth: 3,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
  },
   text: {
  // backgroundColor:"red",
  width:"50%"
  }
});
