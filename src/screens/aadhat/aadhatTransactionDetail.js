import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ToastError, ToastSuccess } from '../../utils/toast';
import Loader from '../../components/loader';
import { useRoute, useTheme } from '@react-navigation/native';
import { navigate, replace } from '../../navigation/ref';
import Text from '../../components/text';
import { currencyFormat, dateTimeFormat, dayCount } from '../../utils/dateformat';
import Header from '../../components/header';
import Button from '../../components/button';
import { strings } from '../../translations/locale';
import BaseView from 'src/container/base';
import { getInterest } from '@utils/helper';
import { common } from '@utils/style';
import DeleteModal from '@container/deleteModal';
import { deleteAmountTransaction } from '@network/aadhat-service';

export default function AadhatTransactionDetail() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const data = params?.data ?? [];
  const item = params?.item ?? {};
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await deleteAmountTransaction(item);
      ToastSuccess(strings.successfully_deleted);
      navigate('Aadhat');
    } catch (error) {
      ToastError(error?.message);
    } finally {
      setLoading(false);
    }
  }, [item]);

  const days = dayCount(item?.date);
  const interestRate = data[0]?.interest_rate || 0;
  const interest = getInterest([{ ...item, interest_rate: interestRate }]);

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header back label={data[0]?.name} />
      <ScrollView
        contentContainerStyle={[
          common.centerAlignedJustify,
          common.card,
          common.shadow,
          { backgroundColor: colors.background, margin: 20 },
        ]}
      >
        <Text h5 style={{ marginBottom: 10 }}>
          {dateTimeFormat(item?.date)}
        </Text>
        <DetailsCard label={strings.total_principal} value={currencyFormat(item?.amount)} />
        <DetailsCard label={strings.interest} value={currencyFormat(parseFloat(interestRate))} />
        <DetailsCard label={strings.day} value={days} />
        <DetailsCard label={strings.total_interest} value={currencyFormat(interest)} />
        <DetailsCard
          label={strings.total_amount}
          value={currencyFormat(interest + parseFloat(item.amount))}
          isBold
        />
        {item?.crop && (
          <View style={[common.topline, { marginTop: 20, borderTopColor: colors.border + 50 }]}>
            <DetailsCard label={strings.crop} value={item?.crop} />
            <DetailsCard label={strings.weight} value={`${item?.weight} Qtl.`} />
            <DetailsCard label={strings.enter_rate} value={currencyFormat(item?.rate)} />
          </View>
        )}
        {item?.detail && (
          <View style={[common.centerAlignedJustify, common.topline, { marginTop: 40, borderTopColor: colors.border + 50 }]}>
            <Text h3 semi>{strings.remark}</Text>
            <Text h4 center style={{ marginTop: 10 }}>
              {item?.detail}
            </Text>
          </View>
        )}
      </ScrollView>
      <View style={[common.row_btw, { margin: 20, maxWidth: '90%' }]}>
        <Button
          iconLeft="edit"
          label={strings.edit}
          btnStyle={{ width: '45%' }}
          onPress={() => replace('AddTransaction', { data: data[0], item, isCrop: item?.crop })}
        />
        <Button
          iconLeft="delete"
          label={strings.delete}
          btnStyle={{ width: '45%', backgroundColor: colors.error }}
          onPress={() => setOpenModal(true)}
        />
      </View>
      <DeleteModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={data[0]}
        customDescription={strings.alert_single_delete}
        onDelete={handleDelete}
      />
    </BaseView>
  );
}

const DetailsCard = ({ label, value, isBold }) => (
  <View style={styles.card}>
    <Text h4>{label}</Text>
    <Text h3 bold={isBold}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    padding: 10,
    ...common.row_btw,
  },
});
