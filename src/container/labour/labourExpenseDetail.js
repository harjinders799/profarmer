import { View, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import Text from 'src/components/text';
import { strings } from 'src/translations/locale';
import { dateFormat } from 'src/utils/dateformat';
import { useTheme } from '@react-navigation/native';
import { goBack, navigate } from '../../navigation/ref';
import { currencyFormat } from '../../utils/dateformat';
import { common } from '@utils/style';

export default function LabourExpenseDetail({ data, expense }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.list, { backgroundColor: colors.background }]}>
      <Text h4 center bold>
        {strings.given_amount}
      </Text>
      {Array.isArray(expense) && expense.length ? (
        expense.map(
          (v, i) => (
            <Pressable
              key={i}
              style={[expense.length !== i + 1 && common.underline]}
              onPress={() => navigate('AddLabourExpense', { item: v, data })}>
              <View style={[styles.row]}>
                <Text h4 numberOfLines={1}>
                  {dateFormat(v?.date)}
                </Text>
                <Text h4 numberOfLines={1}>
                  {currencyFormat(v?.amount)}
                </Text>
              </View>
              {v?.detail ?
                <Text h5 center style={{ paddingTop: 10, fontStyle: 'italic' }}>{v?.detail}</Text>
                : null}
            </Pressable>
          ))) : (
        <Text h4 style={styles.underline}>
          {strings.no_record}</Text>
      )}
      {/* <Text h4>{data?.detail}</Text> */}
      {/* <View style={styles.icons}>
          <Icon
            name="delete"
            size={20}
            color={red}
            style={[styles.icon,]}
            onPress={delteData}
          />
          <Icon
            name="edit"
            size={20}
            color={orange}
            style={[styles.icon,]}
            onPress={() =>
              replace('AddLabourExpense', { data: { ...data, edit: true } })
            }
          />
        </View> */}
    </View>
  );
}
const styles = StyleSheet.create({
  list: {
    ...common.shadow,
    ...common.card,
    margin: '5%',
    marginVertical: 15,
    width: '90%',
    elevation: 5,
  },
  row: {
    ...common.row_btw,
    marginTop: 20,
  },
});
