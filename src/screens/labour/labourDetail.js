import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { sumBy } from 'lodash';

import BaseView from '@container/base';
import Text from '@components/text';
import Loader from '@components/loader';
import Header from '@components/header';
import LabourExpenseDetail from '@container/labour/labourExpenseDetail';
import LabourWorkDetail from '@container/labour/labourWorkDetail';
import LabourDeleteModal from '@container/labour/labourDeleteModal';

import { red, greenDark, } from '@utils/colors';
import { common } from '@utils/style';
import { currencyFormat } from '@utils/dateformat';
import { ToastError } from '@utils/toast';
import { getLabourExpense, getLabourWork } from '@network/labour-service';
import { strings } from '@translations/locale';
import { laborHTMLFormat } from '@html/labour';
import { useAuth } from '@context/authContext';
import { navigate } from '@navigation/ref';

const LabourDetail = ({ navigation }) => {
  const { params } = useRoute();
  const { colors } = useTheme();
  const { user } = useAuth();
  const data = params?.item ?? [];

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [work, setWork] = useState([]);
  const [expense, setExpense] = useState([]);

  useEffect(() => {
    const unsubscribeWork = getLabourWork(data?.id, updatedWork => {
      setWork(updatedWork);
      setLoading(false);
    });
    const unsubscribeExpense = getLabourExpense(data?.id, updatedExpense => {
      setExpense(updatedExpense);
      setLoading(false);
    });
    return () => {
      if (unsubscribeWork) unsubscribeWork();
      if (unsubscribeExpense) unsubscribeExpense();
    };
  }, [data]);
  console.log({ work, expense })
  const totalLabour = useMemo(() => sumBy(work, o => parseFloat(o?.count)), [work]);
  const labourAmount = useMemo(() => currencyFormat(sumBy(work, o => parseFloat(o?.count) * parseFloat(o?.rate))), [work]);
  const givenAmount = useMemo(() => currencyFormat(sumBy(expense, o => parseFloat(o?.amount))), [expense]);
  const finalAmount = useMemo(() => currencyFormat(totalLabour * parseFloat(work?.[0]?.rate) - sumBy(expense, o => parseFloat(o?.amount))), [totalLabour, expense]);

  const handleShare = useCallback(async () => {
    const html = laborHTMLFormat(strings, user, data, work, expense);
    const options = {
      html,
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
    }).catch(err => console.log(err));
  }, [user, data, work, expense]);

  return (
    <BaseView style={{ paddingHorizontal: 0 }}>
      <Loader visible={loading} />
      <Header
        back
        label={data?.name}
        deleteIcon
        share
        onDeletePress={() => setOpenModal(true)}
        onSharePress={handleShare}
      />
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.row, { backgroundColor: colors.background }]}>
          <View style={[styles.card, { backgroundColor: '#bbdffc' }]}>
            <Text h2 bold>{totalLabour}</Text>
            <Text h3>{strings.total_labour}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#ffccaa' }]}>
            <Text h2 bold>{labourAmount}</Text>
            <Text h3>{strings.labour_amount}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#bee8ba' }]}>
            <Text h2 bold>{givenAmount}</Text>
            <Text h3>{strings.given_amount}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#e5e5e5' }]}>
            <Text h2 bold color={totalLabour - sumBy(expense, o => parseFloat(o?.amount)) > 0 ? greenDark : red}>
              {finalAmount}
            </Text>
            <Text h3>{strings.final}</Text>
          </View>
        </View>
        <LabourWorkDetail data={data} work={work} />
        <LabourExpenseDetail data={data} expense={expense} />
      </ScrollView>
      <LabourDeleteModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={data}
      />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  row: {
    ...common.row_btw,
    marginVertical: 5,
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  card: {
    ...common.card,
    ...common.shadow,
    width: '48%',
    marginVertical: 5,
    padding: 10,
  },
});

export default LabourDetail;
