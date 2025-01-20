import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useRoute, useTheme } from '@react-navigation/native';
import { goBack, navigate } from '@navigation/ref';
import { deleteCropCollection, getCropEvents } from '@network/crop-service';
import BaseView from '@container/base';
import Loader from '@components/loader';
import Header from '@components/header';
import DeleteModal from '@container/deleteModal';
import CropEventDetail from '@container/crop/cropEventDetail';
import Text from '@components/text';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from 'react-native-reanimated';
import {
  currencyFormat,
  dateFormat,
  dayCount,
  getTimeDetails,
} from '@utils/dateformat';
import { ToastError, ToastProgress } from '@utils/toast';
import { common } from '@utils/style';
import { white } from '@utils/colors';
import { strings } from '@translations/locale';
import CropMenuModal from '@container/crop/cropMenuModal';
import { useCropTracker } from '@context/cropTrackerContext';
import auth from '@react-native-firebase/auth';
import Button from '@components/button';
import { getRemindersData } from '@network/reminder-service';
import ReminderList from '@container/reminder/reminderList';

const CropDetail = () => {
  const { params } = useRoute();
  const { colors } = useTheme();
  const { selectedCrop, events, selectedLand, myCrops, loading } = useCropTracker();
  const data =
    selectedCrop ||
    params?.item ||
    {};
  const [openModal, setOpenModal] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [expandReminders, setExpandReminders] = useState(false);
  console.log({ selectedCrop })
  const fetchData = useCallback(() => {
    const unsubscribe = getRemindersData(
      updatedDocuments => {
        setReminders(updatedDocuments);
      },
      'cropTracker',
      data?.id,
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [colors]);

  useFocusEffect(fetchData);

  const handleDelete = useCallback(async () => {
    try {
      await deleteCropCollection(data?.id);
      goBack();
    } catch (error) {
      ToastError(error?.message);
    }
  }, [data]);

  const totalEarning = useMemo(() => data?.total_earning, [data]);

  const totalExpense = useMemo(() => data?.total_expense, [data]);

  const finalAmount = useMemo(
    () => totalEarning - totalExpense,
    [totalEarning, totalExpense],
  );

  const finalAmountColor = finalAmount < 0 ? colors.error : colors.success;
  const finalAmountText = finalAmount < 0 ? strings.loss : strings.profit; // Localization

  let remaining, passed;
  // Check if reminders is a valid array and has items
  if (Array.isArray(reminders) && reminders.length) {
    const { remaining: remainingTime, passed: passedTime } = getTimeDetails(
      Date.now(),
      reminders[0]?.reminderDate,
    );
    remaining = remainingTime;
    passed = passedTime;
  }

  return (
    <BaseView style={styles.baseView}>
      <Loader visible={loading} />
      <Header
        back
        label={data?.name}
        rightComponent={
          <CropMenuModal
            handleShare={() => ToastProgress('Coming Soon')}
            onDeletePress={() => setOpenModal(true)}
            onEditPress={() => navigate('AddCrop', { data: selectedLand, crop: selectedCrop })}
            onAnalysisPress={() => navigate('CropAnalysis', { data, events })}
            onStopPress={() => navigate('AddCrop', { data, addStopDate: true })}
            isOwner={data?.uid == auth().currentUser?.uid}
          />
        }
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <Animated.View
            entering={FadeInLeft.delay(300).duration(500)}
            style={[styles.card, { backgroundColor: colors.error }]}>
            <Text h4 bold color={white}>
              {currencyFormat(totalExpense, 2)}
            </Text>
            <Text h5 medium color={white} style={styles.label}>
              {strings.total_expense}
            </Text>
          </Animated.View>
          <Animated.View
            entering={FadeInRight.delay(300).duration(500)}
            style={[styles.card, { backgroundColor: colors.success }]}>
            <Text h4 bold color={white}>
              {currencyFormat(totalEarning, 2)}
            </Text>
            <Text h5 medium color={white} style={styles.label}>
              {strings.total_earning}
            </Text>
          </Animated.View>
        </View>
        <Animated.View
          entering={FadeInUp.delay(300).duration(500)}
          style={[
            styles.finalAmountCard,
            { backgroundColor: colors.secondaryCard },
          ]}>
          <View style={common.row_btw}>
            <Text h4 bold>
              {strings.final_amount}
            </Text>
            <Text h2 bold color={finalAmountColor}>
              {currencyFormat(finalAmount > 0 ? finalAmount : -finalAmount)}
            </Text>
          </View>
          <Text
            h6
            center
            color={finalAmountColor}
            style={styles.finalAmountText}>
            {finalAmountText}
          </Text>
        </Animated.View>
        <Button
          small
          label={`${strings.add} ${strings.reminder}`}
          btnStyle={{
            width: 'auto',
            maxWidth: '30%',
            alignSelf: 'flex-end',
            height: 25,
            marginRight: 20,
          }}
          onPress={() =>
            navigate('AddReminder', { type: 'cropTracker', typeId: data?.id })
          }
        />
        {Array.isArray(reminders) && reminders.length ? (
          <Animated.View
            entering={FadeInUp.delay(300).duration(500)}
            style={[
              // common.row_btw,
              common.underline,
              { marginVertical: 5, paddingHorizontal: 20 },
            ]}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                left: 20,
                top: expandReminders ? -10 : 5,
              }}
              hitSlop={40}
              onPress={() => setExpandReminders(prevs => !prevs)}>
              <Text onPress={() => setExpandReminders(prevs => !prevs)}>
                {strings.view}
              </Text>
            </TouchableOpacity>
            {!expandReminders ? (
              <Text h5 right>
                {reminders[0]?.title}{' '}
                <Text
                  // h5
                  bold
                  color={
                    reminders[0]?.status == 'completed'
                      ? colors.success
                      : (remaining && remaining.includes('day')) || passed
                        ? colors.error
                        : colors.success
                  }>
                  {reminders[0]?.status == 'completed'
                    ? strings[reminders[0]?.status]
                    : remaining || passed}
                </Text>
              </Text>
            ) : (
              <ReminderList data={reminders} />
            )}
          </Animated.View>
        ) : null}
        <Animated.View
          entering={FadeInUp.delay(350).duration(500)}
          style={[common.row_btw, { paddingHorizontal: 20 }]}>
          <Text center h4>
            {strings.farm}
          </Text>
          <Text center h4>
            {`${data?.farm ?? '--'}`}
          </Text>
        </Animated.View>
        <Animated.View
          entering={FadeInUp.delay(350).duration(500)}
          style={[common.row_btw, { marginVertical: 5, paddingHorizontal: 20 }]}>
          <Text center h4>
            {strings.total_area}
          </Text>
          <Text center h4>
            {`${data?.totalArea ?? '--'} ${strings[data?.areaUnit] ?? '--'}`}
          </Text>
        </Animated.View>
        {data?.dateOfSowing ? (
          <>
            <Animated.View
              entering={FadeInUp.delay(350).duration(500)}
              style={[
                common.row_btw,
                { marginVertical: 5, paddingHorizontal: 20 },
              ]}>
              <Text center h4>
                {strings.date_of_sowing}
              </Text>
              <Text center h4>
                {`${dateFormat(data?.dateOfSowing) ?? '--'}`}
              </Text>
            </Animated.View>
            {data?.cropPeriodCompleted ? (
              <Animated.View
                entering={FadeInUp.delay(350).duration(500)}
                style={[
                  common.row_btw,
                  { marginVertical: 5, paddingHorizontal: 20 },
                ]}>
                <Text center h4>
                  {strings.crop_period_completed}
                </Text>
                <Text center h4>
                  {`${dateFormat(data?.cropPeriodCompleted) ?? '--'}`}
                </Text>
              </Animated.View>
            ) : null}
            <Animated.View
              entering={FadeInUp.delay(350).duration(500)}
              style={[
                common.row_btw,
                { marginVertical: 5, paddingHorizontal: 20 },
              ]}>
              <Text center h4>
                {data?.cropPeriodCompleted
                  ? strings.crop_period
                  : strings.total_days_from_sowing}
              </Text>
              <Text center h4>
                {`${dayCount(data?.dateOfSowing, data?.cropPeriodCompleted) ??
                  '--'
                  } ${strings.day}`}
              </Text>
            </Animated.View>
          </>
        ) : null}
        <View style={common.underline} />
        <CropEventDetail data={data} events={events} />
      </ScrollView>
      <DeleteModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={data}
        onDelete={handleDelete}
      />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  baseView: {
    paddingHorizontal: 0,
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 150,
  },
  row: {
    ...common.row_btw,
    marginVertical: 5,
    width: '95%',
    marginHorizontal: '2.5%',
  },
  card: {
    ...common.card,
    ...common.shadow,
    maxWidth: '50%',
    minWidth: '35%',
    marginBottom: 10,
  },
  label: {
    paddingTop: 5,
  },
  finalAmountCard: {
    ...common.card,
    ...common.shadow,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  finalAmountText: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
  },
});

export default React.memo(CropDetail);
