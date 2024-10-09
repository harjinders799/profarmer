import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import { sumBy } from 'lodash';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

import BaseView from 'src/container/base';
import Text from 'src/components/text';
import { greenDark } from 'src/utils/colors';
import { strings } from 'src/translations/locale';
import { getLabourExpense, getLabourLeave } from '@network/labour-service';
import { currencyFormat, dateFormat, dayCount } from '@utils/dateformat';
import { useAuth } from '@context/authContext';
import { ToastError } from '@utils/toast';

import LabourExpenseDetail from '@container/labour/labourExpenseDetail';
import LabourLeaveDetail from '@container/labour/labourLeaveDetail';
import LabourWorkDetail from '@container/labour/labourWorkDetail';
import LabourDeleteModal from '@container/labour/labourDeleteModal';
import Header from '@components/header';

import { regularLaborHTMLFormat } from '@html/labour';
import { common } from '@utils/style';
import { navigate } from '@navigation/ref';

const RegularLabourDetail = () => {
  const { params } = useRoute();
  const { colors } = useTheme();
  const { user } = useAuth();
  const data = params?.item ?? [];
  const [expense, setExpense] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const unsubscribeLeave = getLabourLeave(data?.id, updatedLeaves => setLeaves(updatedLeaves));
    const unsubscribeExpense = getLabourExpense(data?.id, updatedExpense => setExpense(updatedExpense));

    return () => {
      if (unsubscribeLeave) unsubscribeLeave();
      if (unsubscribeExpense) unsubscribeExpense();
    };
  }, [data]);

  const onShare = async () => {
    const html = regularLaborHTMLFormat(strings, user, data, leaves, expense);
    const options = { html, base64: true, fileName: data?.name, directory: 'Documents' };
    const file = await RNHTMLtoPDF.convert(options);

    Share.open({
      // url: `data:application/pdf;base64,${file?.base64}`,
      url: `file://${file?.filePath}`,
      message: strings.shareMessage,
      type: 'application/pdf',
      title: data?.name,
      // saveToFiles: true,
      showAppsToView: true,
      filename: data?.name,
    })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  const days = dayCount(data?.start_date);
  const totalLabourAmount = days * parseFloat(data?.labour_rate) - sumBy(leaves, o => parseFloat(o.count)) * parseFloat(data?.labour_rate);
  const totalLabourGiven = sumBy(expense, o => parseFloat(o.amount));
  const balanceColor = totalLabourAmount - totalLabourGiven > 0 ? greenDark : colors.error;

  const Final = () => (
    <View style={[styles.row, { borderBottomColor: colors.background, backgroundColor: colors.background, marginBottom: 20, borderBottomEndRadius: 10, borderBottomStartRadius: 10 }]}>
      <Text h3>{strings.final}</Text>
      <Text h3 style={{ color: balanceColor }}>{currencyFormat(totalLabourAmount - totalLabourGiven)}</Text>
    </View>
  );

  return (
    <BaseView>
      <Header back label={data?.name} deleteIcon share onDeletePress={() => setOpenModal(true)} onSharePress={onShare} />

      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 150 }} stickyHeaderIndices={[8]} showsVerticalScrollIndicator={false}>
        <Text center style={{ color: colors.success, marginBottom: 10 }} h6>{data?.is_regular ? strings.regular : ''}</Text>
        <View style={[styles.row, { backgroundColor: colors.background, borderBottomColor: colors.border, borderTopEndRadius: 10, borderTopStartRadius: 10 }]}>
          <Text h4>{strings.start_date}</Text>
          <Text h4 style={{ color: colors.success }}>{dateFormat(data?.start_date)}</Text>
        </View>
        <View style={[styles.row, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          <Text h4>{strings.total_days_from_start}</Text>
          <Text h4 style={{ color: colors.success }}>{days}</Text>
        </View>
        <View style={[styles.row, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          <Text h4>{strings.leaves}</Text>
          <Text h4 style={{ color: colors.error }}>{sumBy(leaves, o => parseFloat(o.count))}</Text>
        </View>
        <View style={[styles.row, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          <Text h4>{strings.labour_day}</Text>
          <Text h4 style={{ color: colors.success }}>{days - sumBy(leaves, o => parseFloat(o.count))}</Text>
        </View>
        <View style={[styles.row, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          <Text h4>{strings.labour_rate}</Text>
          <Text h4 style={{ color: colors.success }}>{currencyFormat(data?.labour_rate)}</Text>
        </View>
        <View style={[styles.row, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          <Text h4>{strings.total_labour_amount}</Text>
          <Text h4 style={{ color: colors.success }}>{currencyFormat(totalLabourAmount)}</Text>
        </View>
        <View style={[styles.row, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          <Text h4>{strings.given_amount}</Text>
          <Text h4 style={{ color: colors.error }}>{currencyFormat(totalLabourGiven)}</Text>
        </View>
        <Final />

        <LabourExpenseDetail data={data} expense={expense} />
        <LabourLeaveDetail data={data} leaves={leaves} />
        <LabourDeleteModal openModal={openModal} setOpenModal={setOpenModal} data={data} />
      </ScrollView>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  row: {
    ...common.row_btw,
    ...common.shadow,
    width: '90%',
    marginHorizontal: '5%',
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    paddingVertical: 15,
  },
});

export default RegularLabourDetail;
