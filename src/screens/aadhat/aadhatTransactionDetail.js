import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { ToastError, ToastSuccess } from '../../utils/toast';
import Loader from '../../components/loader';
import { useRoute, useTheme } from '@react-navigation/native';
import { navigate, replace } from '../../navigation/ref';
import Text from '../../components/text';
import {
  currencyFormat,
  dateFormat,
  dateTimeFormat,
  dayCount,
} from '../../utils/dateformat';
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
  const data = params?.data ?? {};
  const item = params?.item ?? {};
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteAmountTransaction(item);
      setLoading(false);
      ToastSuccess(strings.amount_deleted, strings.amount);
      navigate('Aadhat');
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.loan);
    }
  };

  let days = dayCount(item?.date);
  let interest = getInterest([
    { ...item, interest_rate: data[0]?.interest_rate },
  ]);

  return (
    <BaseView >
      <Loader visible={loading} />
      <Header back label={data[0]?.name} />
      <ScrollView
        contentContainerStyle={[
          common.centerAlignedJustify,
          common.card,
          common.shadow,
          { backgroundColor: colors.background, margin: 20 },
        ]}>
        <Text h5 style={{ marginBottom: 10 }}>
          {dateTimeFormat(item?.date)}
        </Text>
        <View style={styles.card}>
          <Text h4>{strings.total_principal}</Text>
          <Text h3>{currencyFormat(item?.amount)}</Text>
        </View>
        <View style={styles.card}>
          <Text h4>{strings.interest}</Text>
          <Text h3>{currencyFormat(parseFloat(data[0]?.interest_rate))}</Text>
        </View>
        <View style={styles.card}>
          <Text h4>{strings.day}</Text>
          <Text h3>{days}</Text>
        </View>
        <View style={styles.card}>
          <Text h4>{strings.total_interest}</Text>
          <Text h3 numberOfLines={1}>
            {currencyFormat(interest)}
          </Text>
        </View>
        <View style={styles.card}>
          <Text h4 bold>
            {strings.total_amount}
          </Text>
          <Text h3 bold>
            {currencyFormat(interest + parseFloat(item.amount))}
          </Text>
        </View>
        <View
          style={[
            common.topline,
            {
              marginTop: 20,
              borderTopColor: colors.border + 50,
              display: item?.crop ? 'flex' : 'none',
            },
          ]}>
          <View style={styles.card}>
            <Text h4>{strings.crop}</Text>
            <Text h3 numberOfLines={1}>
              {item?.crop}
            </Text>
          </View>
          <View style={styles.card}>
            <Text h4>{strings.weight}</Text>
            <Text h3 numberOfLines={1}>
              {item?.weight}
            </Text>
          </View>
          <View style={styles.card}>
            <Text h4>{strings.enter_rate}</Text>
            <Text h3 numberOfLines={1}>
              {currencyFormat(item?.rate)}
            </Text>
          </View>
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
      </ScrollView>
      <View style={[common.row_btw, { margin: 20, maxWidth: '90%' }]}>
        <Button
          iconLeft="edit"
          label={strings.edit}
          btnStyle={{
            width: '45%',
          }}
          onPress={() =>
            replace('AddTransaction', {
              data: data[0],
              item,
            })
          }
        />
        <Button
          iconLeft="delete"
          label={strings.delete}
          btnStyle={{
            width: '45%',
            backgroundColor: colors.error,
          }}
          onPress={() => setOpenModal(true)}
        />
      </View>
      <DeleteModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={data[0]}
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
