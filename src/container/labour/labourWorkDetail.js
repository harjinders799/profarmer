import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Text from '@components/text';
import { navigate } from '@navigation/ref';
import { strings } from '@translations/locale';
import { dateFormat } from '@utils/dateformat';
import { useTheme } from '@react-navigation/native';
import { currencyFormat } from '@utils/dateformat';
import { common } from '@utils/style';

function LabourWorkDetail({ data, work }) {
  const { colors } = useTheme();

  const handleNavigate = useCallback((item) => {
    navigate('AddLabour', { item, data });
  }, [data]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, display: data?.is_regular ? 'none' : 'flex' }]}>
      <Text h4 bold center>
        {strings.labour_record}
      </Text>
      {Array.isArray(work) && work.length && !data?.is_regular ? (
        work.map((item, index) => (
          <Pressable
            key={index}
            style={index !== work.length - 1 && common.underline}
            onPress={() => handleNavigate(item)}>
            <View style={styles.row}>
              <Text h4>
                {item?.count} {strings.labour}
              </Text>
              <Text h4>
                {currencyFormat(parseFloat(item?.rate) * parseFloat(item?.count))}
              </Text>
              <Text h6>{dateFormat(item?.date)}</Text>
            </View>
            {item?.detail && (
              <Text h5 style={styles.detail}>
                {item.detail}
              </Text>
            )}
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
  container: {
    ...common.shadow,
    ...common.card,
    margin: '5%',
    marginVertical: 15,
    width: '90%',
    elevation: 5,
  },
  row: {
    ...common.row_top_btw,
    width: '100%',
    marginTop: 20,
  },
  detail: {
    paddingTop: 10,
    fontStyle: 'italic',
  },
});

export default React.memo(LabourWorkDetail);
