import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

import BaseView from '@container/base';
import Loader from '@components/loader';
import Header from '@components/header';

import { common } from '@utils/style';
import { currencyFormat } from '@utils/dateformat';
import { ToastError } from '@utils/toast';
import { strings } from '@translations/locale';
import { laborHTMLFormat } from '@html/labour';
import { useAuth } from '@context/authContext';
import { goBack, navigate } from '@navigation/ref';
import { deleteCropCollection, getCropEvents } from '@network/crop-service';
import DeleteModal from '@container/deleteModal';
import Text from '@components/text';
import CropEventDetail from '@container/crop/cropEventDetail';
import Animated, { FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated';

const CropDetail = () => {
  const { params } = useRoute();
  const { colors } = useTheme();
  const { user } = useAuth();
  const data = params?.item ?? [];

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribeWork = getCropEvents(data?.id, updatedEvents => {
      setEvents(updatedEvents);
      setLoading(false);
    });
    return () => {
      if (unsubscribeWork) unsubscribeWork();
    };
  }, [data]);

  let finalAmount = data?.total_earning - data?.total_expense;

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteCropCollection(data?.id);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
    }
  };

  return (
    <BaseView style={{ paddingHorizontal: 0 }}>
      <Loader visible={loading} />
      <Header
        back
        label={data?.name}
        deleteIcon
        onDeletePress={() => setOpenModal(true)}
      />
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 150 }}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.row]}>
          <Animated.View
            entering={FadeInLeft.delay(300).duration(500)}
            style={[styles.card, { backgroundColor: colors.error }]}>
            <Text h4 bold color={colors.background}>
              {currencyFormat(data?.total_expense, 2)}
            </Text>
            <Text h5 medium color={colors.background} style={{ paddingTop: 5 }}>
              Total Expense
            </Text>
          </Animated.View>
          <Animated.View
            entering={FadeInRight.delay(300).duration(500)}
            style={[styles.card, { backgroundColor: colors.success }]}>
            <Text h4 bold color={colors.background}>
              {currencyFormat(data?.total_earning, 2)}
            </Text>
            <Text h5 medium color={colors.background} style={{ paddingTop: 5 }}>
              Total Earning
            </Text>
          </Animated.View>
        </View>
        <Animated.View
          entering={FadeInUp.delay(300).duration(500)}
          style={[
            {
              ...common.card,
              ...common.shadow,
              paddingVertical: 15,
              marginHorizontal: 20,
              backgroundColor: colors.secondaryCard,
            },
          ]}>
          <View style={common.row_btw}>
            <Text h4 bold>
              Final Amount
            </Text>
            <Text
              h2
              bold
              color={finalAmount < 0 ? colors.error : colors.success}>
              {currencyFormat(finalAmount > 0 ? finalAmount : -finalAmount)}
            </Text>
          </View>
          <Text
            h6
            center
            color={finalAmount < 0 ? colors.error : colors.success}
            style={{ position: 'absolute', bottom: -10, alignSelf: 'center' }}>
            {finalAmount < 0 ? 'Loss' : 'Profit'}
          </Text>
        </Animated.View>
        <CropEventDetail data={data} events={events} />
      </ScrollView>
      <DeleteModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={data}
        onDelete={onDelete}
      />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  row: {
    ...common.row_btw,
    marginVertical: 5,
    width: '90%',
    marginHorizontal: '5%',
  },
  card: {
    ...common.card,
    ...common.shadow,
    maxWidth: '50%',
    marginBottom: 10,
    padding: 15,
  },
});

export default CropDetail;
