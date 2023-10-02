import React, { useCallback, useEffect, useState } from 'react';
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
import { green, red, white } from 'src/utils/color';
import moment from 'moment';
import { sortBy, groupBy, sumBy } from 'lodash';
import { useFocusEffect, useIsFocused, useRoute, useTheme } from '@react-navigation/native';
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

import { deleteGiverCollection } from '../../network/interest-service';

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
import { useLoan } from '../../context/loanContext';
import { getLoanData } from '../../network/loan-service';
import LoanDetailAction from '../../components/loanDetailAction';
import auth from '@react-native-firebase/auth';
import { getTotalInterst } from '../../utils/helper';

const transparent = 'rgba(0,0,0,0.5)';

export default function LoanDetail() {
  const { params } = useRoute();
  const data = params?.item ?? {};
  const { loanData = [], getLoan } = useLoan();
  const isFocused = useIsFocused();
  const personName = data?.name;

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
          <Text h2 style={{ color: white }}>
            {data?.name}
          </Text>
        }
        rightComponent={
          <View style={{ flexDirection: 'row' }}>
            {/* <Icon
              name="pdffile1"
              size={25}
              color={white}
              style={{
                marginRight: 15,
              }}
            /> */}

            <TouchableOpacity
              onPress={() => {
                // setopenModal(true);
                ToastProgress(strings.in_progress)
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
        <View style={[styles.card, { borderColor: greenLight }]}>
          <Text h4 style={styles.text}>
            {strings.taken_amount_with_interest}
          </Text>
          <Text h3 style={{ color: lightRed }}>
            {currencyFormat(takenAmountWithInterest)}
          </Text>
        </View>
        <View style={[styles.card, { borderColor: peach }]}>
          <Text h4 style={styles.text}>
            {strings.given_amount_with_interest}
          </Text>
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
        <View style={[styles.card, { borderColor: lightYellow }]}>
          <Text h3>{strings.total_amount}</Text>
          <Text h3 style={{ color: finalAmount >= 0 ? green : red }}>
            {currencyFormat(finalAmount)}
          </Text>
        </View>
      </View>
      <View style={styles.wt}>
        <Text
          h3
          style={[
            styles.underline,
            { backgroundColor: greenLight, width: '100%', textAlign: 'center' },
          ]}>
          {strings.loan}
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
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingBottom: '100%' }}
          showsVerticalScrollIndicator={false}>
          {Array.isArray(groupedData) && groupedData.length ? (
            sortBy(
              groupedData,
              (a, b) => moment(b?.date) - moment(a?.date),
            ).map((v, i) => <LoanDetailAction key={i} data={v} />)
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
    width: '50%',
  },
});
