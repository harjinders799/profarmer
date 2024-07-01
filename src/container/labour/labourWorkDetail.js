import {
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import React from 'react';
import Text from 'src/components/text';
import { navigate } from 'src/navigation/ref';
import { strings } from 'src/translations/locale';
import { dateFormat } from 'src/utils/dateformat';
import { useTheme } from '@react-navigation/native';
import { currencyFormat } from '../../utils/dateformat';
import { common } from '@utils/style';

export default function LabourWorkDetail({ data, work }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.list,
        {
          backgroundColor: colors.background,
          display: data?.is_regular ? 'none' : 'flex',
        },
      ]}>
      <Text h4 bold center>
        {strings.labour_record}
      </Text>
      {Array.isArray(work) && work.length && !data?.is_regular ? (
        work.map((v, i) => (
          <Pressable
            key={i}
            style={[work.length !== i + 1 && common.underline]}
            onPress={() => navigate('AddLabour', { item: v, data })}>
            <View style={[styles.row]}>
              <Text h4>{dateFormat(v?.date)}</Text>
              <Text h4>
                {v?.count}
                {' ' + strings.labour}
              </Text>
              {/* <Text h4>
                    {currencyFormat(v?.rate)}</Text> */}
              <Text h4>
                {currencyFormat(parseFloat(v?.rate) * parseFloat(v?.count))}
              </Text>
            </View>
            {v?.detail ? (
              <Text h5 center style={{ paddingTop: 10, fontStyle: 'italic' }}>
                {v?.detail}
              </Text>
            ) : null}
          </Pressable>
        ))
      ) : (
        <Text h4 style={styles.underline}>
          {strings.no_record}
        </Text>
      )}
      {/* <View style={styles.icons}>
          <Icon
          name="edit"
          size={20}
          color={orange}
          style={[styles.icon, { backgroundColor: gray2 }]}
          onPress={() => navigate('AddLabour', { data: { ...data, edit: true } })}
        />
        {data?.is_regulare ? (
          <Text h3 style={{ color: green, marginTop: 15 }}>
            {strings.regular}
          </Text>
        ) : null}
        {totalExpense < 1 || totalLabour > 1 ? (
          <Icon
            name="delete"
            size={20}
            color={red}
            style={[styles.icon, { backgroundColor: gray2 }]}
            onPress={delteData}
          />
        ) : null}
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
