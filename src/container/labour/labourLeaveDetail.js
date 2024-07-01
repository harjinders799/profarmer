import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Text from '@components/text';
import { navigate } from '@navigation/ref';
import { strings } from '@translations/locale';
import { dateFormat } from '@utils/dateformat';
import { useTheme } from '@react-navigation/native';
import { common } from '@utils/style';

function LabourLeaveDetail({ data, leaves }) {
  const { colors } = useTheme();

  const handleNavigate = useCallback((item) => {
    navigate('AddLabourLeave', { item, data });
  }, [data]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text h4 bold center>
        {strings.leaves}
      </Text>
      {leaves?.length > 0 ? (
        leaves.map((item, index) => (
          <Pressable
            key={index}
            style={index !== leaves.length - 1 && common.underline}
            onPress={() => handleNavigate(item)}>
            <View style={styles.row}>
              <Text h4>{dateFormat(item?.date)}</Text>
              <Text h4>
                {item?.count} {strings.leave}
              </Text>
              {item?.detail && (
                <Text h5 center style={styles.detail}>
                  {item.detail}
                </Text>
              )}
            </View>
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
    ...common.row_btw,
    marginTop: 20,
  },
  detail: {
    paddingTop: 10,
    fontStyle: 'italic',
  },
});

export default React.memo(LabourLeaveDetail);
