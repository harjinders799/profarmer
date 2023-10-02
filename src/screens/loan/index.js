import {StyleSheet, View} from 'react-native';
import React, {useState, useCallback} from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import {useLang} from 'src/context/langContext';
import Loader from '../../components/loader';
import {strings} from '../../translations/locale';
import Button from '../../components/button';
import {white} from '../../utils/color';

import {navigate} from 'src/navigation/ref';
import LoanList from '../../container/loan/loanList';
import {useLoan} from '../../context/loanContext';
import {useFocusEffect} from '@react-navigation/native';

export default function Loan({navigation}) {
  const {lang} = useLang();
  const {loanData, getLoan} = useLoan();

  useFocusEffect(
    useCallback(() => {
      getLoan();
    }, [navigation, lang]),
  );
  return (
    <BaseView>
      {/* <Loader visible={loading} /> */}
      <Text h2 style={{padding: 20, textAlign: 'center'}}>
        {strings.loan}
      </Text>

      <LoanList />
      <Button
        iconName="plus"
        iconColor={white}
        label={strings.giver + ' / ' + strings.receiver}
        btnStyle={{
          width: '50%',
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

const styles = StyleSheet.create({});
