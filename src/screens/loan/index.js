import { StyleSheet, View } from 'react-native';
import React, { useState, useCallback } from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { useLang } from 'src/context/langContext';
import Loader from '../../components/loader';
import { strings } from '../../translations/locale';
import Button from '../../components/button';
import { greenDark, red, white } from '../../utils/colors';

import { navigate } from 'src/navigation/ref';
import LoanList from '../../container/loan/loanList';
import { useLoan } from '../../context/loanContext';
import { useFocusEffect } from '@react-navigation/native';
import { calculateTotals } from '../../utils/helper';
import { commonStyle } from '../../utils/style';
import { currencyFormat } from '../../utils/dateformat';

export default function Loan({ navigation }) {
  const { lang } = useLang();
  const { loanData, getLoan } = useLoan();

  useFocusEffect(
    useCallback(() => {
      getLoan();
    }, [navigation, lang]),
  );
  const totals = calculateTotals(loanData);

  return (
    <BaseView>
      {/* <Loader visible={loading} /> */}
      <Text h2 style={{ padding: 20, textAlign: 'center' }}>
        {strings.loan_record}
      </Text>
      <View style={commonStyle.row_c_j_b}>
        <View style={[styles.card, { backgroundColor: greenDark }]}>
          <Text h3 white>
            {currencyFormat(totals?.taken ?? 0)}
          </Text>
          <Text h5 white>
            {strings.taken_amount}
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: red }]}>
          <Text h3 white>
            {currencyFormat(totals?.given ?? 0)}
          </Text>
          <Text h5 white>
            {strings.given_amount}
          </Text>
        </View>
      </View>
      <LoanList />
      <Button
        iconName="plus"
        iconColor={white}
        label={strings.giver + ' / ' + strings.receiver}
        btnStyle={{
          width: 'auto',
          paddingHorizontal: 15,
          height: 50,
          position: 'absolute',
          bottom: 20,
          right: 30,
          zIndex: 999,
        }}
        onPress={() => navigate('AddLoan')}
      />
    </BaseView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    width: '48%',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'white',
  },
});
