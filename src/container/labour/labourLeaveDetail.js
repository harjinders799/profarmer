import { View, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import Text from 'src/components/text';
import { navigate } from 'src/navigation/ref';
import { strings } from 'src/translations/locale';
import { dateFormat } from 'src/utils/dateformat';
import { useTheme } from '@react-navigation/native';
import { common } from '@utils/style';

export default function LabourLeaveDetail({ data, leaves }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.list,
        {
          backgroundColor: colors.background,
        },
      ]}>
      <Text h4 bold center>
        {strings.leaves}
      </Text>
      {Array.isArray(leaves) && leaves.length ? (
        leaves.map((v, i) => (
          <Pressable
            key={i}
            style={[leaves.length !== i + 1 && common.underline]}
            onPress={() => navigate('AddLabourLeave', { item: v, data })}>
            <View style={[styles.row]}>
              <Text h4>{dateFormat(v?.date)}</Text>
              <Text h4>
                {v?.count}
                {' ' + strings.leave}
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
