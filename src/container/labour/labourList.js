import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Text from '@components/text';
import Button from '@components/button';
import { strings } from '@translations/locale';
import { navigate } from '@navigation/ref';
import { updateLabourDataCalculation } from '@network/labour-service';
import { green, greenDark, lightRed, navy, red } from '@utils/colors';
import { currencyFormat, dayCount } from '@utils/dateformat';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { common } from '@utils/style';

const ITEM_HEIGHT = 100;

const LabourList = React.memo(({ data }) => {
  const { colors } = useTheme();

  const renderItem = useCallback(({ item }) => {
    if (!item?.total_labour_amount) updateLabourDataCalculation(item?.id);

    const total_labour_amount = item?.is_regular
      ? (dayCount(item.start_date) * parseFloat(item?.labour_rate)) -
      (parseFloat(item?.total_leave) || 0) * parseFloat(item?.labour_rate)
      : parseFloat(item?.total_labour_amount);
    console.log(item)
    const total_labour_given = parseFloat(item?.given_amount);

    const balanceColor =
      total_labour_amount - total_labour_given > 0 ? greenDark : red;

    return (
      <Animated.View style={[styles.list, styles.line]} entering={FadeInUp}>
        <TouchableOpacity
          onPress={() =>
            navigate(
              item?.is_regular ? 'RegularLabourDetail' : 'LabourDetail',
              { item }
            )
          }
        >
          {item?.is_regular && (
            <Text numberOfLines={1} style={{ color: green }} h6>
              {strings.regular + ' ' + strings.labour}
            </Text>
          )}
          <View style={styles.row}>
            <Text numberOfLines={1} h3 style={{ width: '60%' }}>
              {item?.name}
            </Text>
            <Text numberOfLines={1} h3 style={{ color: balanceColor }}>
              {currencyFormat(total_labour_amount - total_labour_given)}
            </Text>
          </View>
          <Animated.View style={styles.row}>
            <View style={[common.row_btw, { width: '80%' }]}>
              <Button
                label={
                  item?.is_regular ? strings.add_leave : strings.add_labour
                }
                hitSlop={10}
                btnStyle={{
                  backgroundColor: item?.is_regular ? lightRed : colors.primary,
                  maxWidth: '40%',
                  marginRight: 10,
                  height: 25,
                  marginVertical: 0,
                }}
                onPress={() =>
                  navigate(
                    item?.is_regular ? 'AddLabourLeave' : 'AddLabour',
                    { data: item }
                  )
                }
              />
              <Button
                hitSlop={10}
                label={strings.add_expense}
                btnStyle={{
                  backgroundColor: navy,
                  maxWidth: '40%',
                  height: 25,
                  marginVertical: 0,
                  borderRadius: 5,
                }}
                onPress={() => navigate('AddLabourExpense', { data: item })}
              />
            </View>
            <Text numberOfLines={1} h3 style={{ color: balanceColor }}>
              {total_labour_amount - total_labour_given > 0
                ? strings.give
                : strings.receive}
            </Text>
          </Animated.View>
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
    []
  );

  const memoizedEmptyComponent = useMemo(() => (
    <Text style={styles.noDataText}>
      {strings.no_data}
    </Text>
  ), []);

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

export default LabourList;
