import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import Loader from '@components/loader';
import { useRoute, useTheme } from '@react-navigation/native';
import { navigate, replace } from '@navigation/ref';
import Text from '@components/text';
import {
  currencyFormat,
  dateTimeFormat,
  dayCount,
  interestFormat,
} from '@utils/dateformat';
import Header from '@components/header';
import Button from '@components/button';
import { strings } from '@translations/locale';
import BaseView from 'src/container/base';
import auth from '@react-native-firebase/auth';
import { getInterst } from '@utils/helper';
import { common } from '@utils/style';
import { useLang } from '@context/langContext';
import DeleteModal from '@container/deleteModal';
import { ToastError, ToastSuccess } from '@utils/toast';
import { deleteLoanTransaction } from '@network/loan-service';

export default function LoanUpdate() {
  const { lang } = useLang();
  const { colors } = useTheme();
  const { params } = useRoute();
  const data = params?.data ?? {};
  const item = params?.item ?? {};
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteLoanTransaction(item);
      setLoading(false);
      ToastSuccess(strings.amount_deleted, strings.amount);
      navigate('Loan');
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.loan);
    }
  };

  let interest = getInterst([{ ...item, interest_rate: data?.interest_rate }]);
  return (
    <BaseView space>
      <Loader visible={loading} />
      <Header back label={data?.name} />
      <View
        style={[
          common.centerAlignedJustify,
          common.card,
          common.shadow,
          { backgroundColor: colors.background },
        ]}>
        <Text
          h2
          color={item?.type == 'receiver' ? colors.success : colors.error}>
          {lang?.code !== 'en' && data?.name}{' '}
          {item?.type == 'receiver' ? strings.received_from : strings.gave_him}{' '}
          {lang?.code == 'en' && data?.name}
        </Text>
        <Text h5>{dateTimeFormat(item?.date)}</Text>
        <View style={styles.card}>
          <Text h4>{strings.total_principal}</Text>
          <Text h3>{currencyFormat(item?.amount)}</Text>
        </View>
        <View style={styles.card}>
          <Text h4>{strings.interest}</Text>
          <Text h3>{interestFormat(data?.interest_rate)}</Text>
        </View>
        <View style={styles.card}>
          <Text h4>{strings.day}</Text>
          <Text h3>{dayCount(item?.date)}</Text>
        </View>
        <View style={styles.card}>
          <Text h4>{strings.total_interest}</Text>
          <Text h3>{currencyFormat(interest)}</Text>
        </View>
        <View style={styles.card}>
          <Text h4 bold>
            {strings.total_amount}
          </Text>
          <Text h3 bold>
            {currencyFormat(interest + item.amount)}
          </Text>
        </View>
        <View
          style={[
            common.centerAlignedJustify,
            common.topline,
            {
              marginTop: 40,
              borderTopColor: colors.border + 50,
              display: item?.detail ? 'flex' : 'none',
            },
          ]}>
          <Text h3 semi>
            {strings.remark}
          </Text>
          <Text h4 center style={{ marginTop: 10 }}>
            {item?.detail}
          </Text>
        </View>
      </View>
      <View style={common.row_btw}>
        <Button
          iconLeft="edit"
          label={strings.edit}
          btnStyle={{
            width: '40%',
          }}
          onPress={() =>
            replace('AddCredit', {
              data,
              item
            })
          }
        />
        <Button
          iconLeft="delete"
          label={strings.delete}
          btnStyle={{
            width: '40%',
            backgroundColor: colors.error,
          }}
          onPress={() => setOpenModal(true)}
        />
      </View>
      <DeleteModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={data}
        customDescription={strings.alert_single_delete}
        onDelete={onDelete}
      />
    </BaseView>
  );
}

const styles = StyleSheet.create({
  list: {
    marginVertical: 5,
    width: '100%',
  },
  card: {
    marginTop: 10,
    padding: 10,
    ...common.row_btw,
  },
});
