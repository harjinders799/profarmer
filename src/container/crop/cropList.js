import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Text from '@components/text';
import Button from '@components/button';
import { strings } from '@translations/locale';
import { navigate } from '@navigation/ref';
import { currencyFormat, dayCount } from '@utils/dateformat';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { common } from '@utils/style';
import { useCropTracker } from '@context/cropTrackerContext';
import auth from '@react-native-firebase/auth'

const ITEM_HEIGHT = 100;

const CropList = React.memo(({ data }) => {
  const { colors } = useTheme();
  const { setSelectedCrop } = useCropTracker();

  const renderItem = useCallback(({ item }) => {
    let finalAmount = item?.total_earning - item?.total_expense;
    const balanceColor = finalAmount >= 0 ? colors.success : colors.error;
    const isOwner = item?.uid == auth().currentUser?.uid
    return (
      <Animated.View style={[styles.list, styles.line]} entering={FadeInUp}>
        <TouchableOpacity onPress={() => {
          setSelectedCrop(item);
          navigate('CropDetail', { item })
        }}>
          <View style={styles.row}>
            <Text numberOfLines={1} h3 style={{ width: '70%' }}>
              {`${item?.name ?? item?.title} (${item?.variety})`}
            </Text>
            <Text numberOfLines={1} h3 color={balanceColor}>
              {currencyFormat(finalAmount > 0 ? finalAmount : -finalAmount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text numberOfLines={1} h3>
              {`${item?.farm}`}
            </Text>

            <Text numberOfLines={1} h3 color={balanceColor}>
              {finalAmount == 0
                ? '--'
                : finalAmount > 0
                  ? strings.profit
                  : strings.loss}
            </Text>
          </View>
          <View style={[styles.row, { marginVertical: 0 }]}>
            <Button
              label={strings.add_activity}
              hitSlop={10}
              small
              btnStyle={{
                maxWidth: '50%',
                width: 'auto',
                display: isOwner ? 'flex' : 'none'
              }}
              onPress={() => navigate('AddEvent', { data: item })}
            />
            {item?.dateOfSowing ? (
              <Text numberOfLines={1} h3>
                {`${dayCount(item?.dateOfSowing, item?.cropPeriodCompleted) ?? '--'} ${strings.day}`}
              </Text>
            ) : (
              <Button
                label={strings.date_of_sowing}
                hitSlop={10}
                small
                btnStyle={{
                  maxWidth: '50%',
                  width: 'auto',
                  backgroundColor: colors.success,
                  display: isOwner ? 'flex' : 'none'
                }}
                onPress={() => navigate('AddCrop', { data: item, addSowingData: true })}
              />
            )}
            {/* <Text numberOfLines={1} h3>
              {item?.farm}
            </Text> */}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, []);

  const keyExtractor = useCallback(item => item.id.toString(), []);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const memoizedEmptyComponent = useMemo(
    () => <Text style={styles.noDataText}>{strings.no_data}</Text>,
    [],
  );

  return (
    <FlatList
      style={styles.flatList}
      contentContainerStyle={styles.contentContainer}
      data={data}
      keyExtractor={keyExtractor}
      ListEmptyComponent={memoizedEmptyComponent}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      getItemLayout={getItemLayout}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
    />
  );
});

const styles = StyleSheet.create({
  flatList: {
    width: '100%',
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  list: {
    marginTop: 20,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    ...common.row_btw,
    marginVertical: 5,
  },
  noDataText: {
    textAlign: 'center',
    paddingTop: 30,
  },
});

export default CropList;
