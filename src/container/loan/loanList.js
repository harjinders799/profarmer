import React, { useCallback } from 'react';
import Text from '@components/text';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { strings } from '@translations/locale';
import { navigate } from '@navigation/ref';
import { currencyFormat } from '@utils/dateformat';
import { greenDark, navy, red } from '@utils/colors';
import { common } from '@utils/style';
import { useTheme } from '@react-navigation/native';
import Button from '@components/button';

function LoanList({ data }) {
  const { colors } = useTheme();
  console.log(data)
  // Optimized renderItem function using useCallback
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          style={[styles.list, { backgroundColor: colors.background }]}
          onPress={() => navigate('LoanDetail', { item })}>
          <View style={styles.row}>
            <Text h3 style={{ maxWidth: '60%' }}>
              {item?.name}
            </Text>
            <Text
              h3
              style={{
                color: item?.finalAmount > 0 ? colors.error : colors.success,
                maxWidth: '40%',
              }}>
              {currencyFormat(item?.finalAmount > 0 ? item?.finalAmount : -item?.finalAmount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Button
              small
              iconLeft={'plus'}
              label={strings.amount}
              btnStyle={styles.btn}
              onPress={() => navigate('AddCredit', {
                data: item,
              })}
            />
            <Text h6 color={item?.finalAmount > 0 ? colors.error : colors.success}>
              {item?.finalAmount == 0 ? '____' : item?.finalAmount < 0 ? strings.give : strings.receive}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [colors]
  );

  // Memoized key extractor
  const keyExtractor = useCallback((item) => item?.id?.toString(), []);

  // Memoized ListEmptyComponent
  const ListEmptyComponent = useCallback(() => (
    <Text style={{ textAlign: 'center', paddingTop: 30 }}>
      {strings.no_data}
    </Text>
  ), []);

  return (
    <FlatList
      style={{ width: '100%' }}
      contentContainerStyle={{ paddingBottom: 150 }}
      data={data}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ListEmptyComponent}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    ...common.card,
    ...common.shadow,
    padding: 10,
    marginHorizontal: '5%',
    marginTop: '5%',
    width: '90%',
  },
  row: {
    ...common.row_btw,
    marginVertical: 5,
  },
  btn: {
    backgroundColor: navy,
    width: 'auto',
    maxWidth: '40%',
    height: 25,
    marginVertical: 0,
    borderRadius: 5,
  }
});

export default React.memo(LoanList);
