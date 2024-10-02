import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Text from '@components/text';
import Button from '@components/button';
import { strings } from '@translations/locale';
import { navigate } from '@navigation/ref';
import { currencyFormat } from '@utils/dateformat';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { common } from '@utils/style';

const ITEM_HEIGHT = 100;

const CropList = React.memo(({ data }) => {
  const { colors } = useTheme();

  const renderItem = useCallback(({ item }) => {
    let finalAmount = item?.total_earning - item?.total_expense
    const balanceColor =
      finalAmount >= 0 ? colors.success : colors.error;

    return (
      <Animated.View style={[styles.list, styles.line]} entering={FadeInUp}>
        <TouchableOpacity
          onPress={() =>
            navigate('CropDetail',
              { item }
            )
          }
        >
          <View style={styles.row}>
            <Text numberOfLines={1} h3 style={{ width: '70%' }}>
              {`${item?.name ?? item?.title} - ${item?.variety} - ${item?.farm}`}
            </Text>
            <Text numberOfLines={1} h3 color={balanceColor}>
              {currencyFormat(finalAmount > 0 ? finalAmount : -finalAmount)}
            </Text>
          </View>
          <Animated.View style={styles.row}>
            <View style={[common.row_btw, { width: '80%' }]}>
              <Button
                label={
                  strings.add_activity
                }
                hitSlop={10}
                btnStyle={{
                  maxWidth: '50%',
                  width: 'auto',
                  height: 25,
                  marginVertical: 0,
                }}
                onPress={() =>
                  navigate(
                    'AddEvent',
                    { data: item }
                  )
                }
              />
            </View>
            <Text numberOfLines={1} h3 color={balanceColor}>
              {finalAmount == 0 ? '--' : finalAmount > 0 ? strings.profit : strings.loss}
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

export default CropList;
