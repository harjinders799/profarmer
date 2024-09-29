import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Text from '@components/text';
import { strings } from '@translations/locale';
import { dateFormat } from '@utils/dateformat';
import { useTheme } from '@react-navigation/native';
import { navigate } from '@navigation/ref';
import { currencyFormat } from '@utils/dateformat';
import { common } from '@utils/style';
import Icon from '@components/icon';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';

function PickerWeightDetail({ data, weights }) {
  const { colors } = useTheme();
  const [expand, setExpand] = useState(true);
  const handleNavigate = useCallback(
    item => {
      navigate('AddPickerWeight', { item, data });
    },
    [data],
  );

  return (
    <Animated.View layout={LinearTransition} style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={common.row_btw}>
        <Text h4 bold>
          {strings.pickers_weight}
        </Text>
        <Text style={{ borderBottomWidth: 0.4 }} onPress={() => setExpand(!expand)}>
          {expand ? "Hide" : "View All"}
        </Text>
      </View>
      {weights?.length > 0 ? (
        (expand ? weights : []).map((item, index) => (
          <Pressable
            key={index}
            style={index !== weights.length - 1 && common.underline}
            onPress={() => handleNavigate(item)}>
            <Animated.View entering={FadeInUp} style={styles.row}>
              <Text h4>
                {item?.weight} <Text h7>Kg</Text>
                <Text color={colors.warning}>{' X '}</Text>
                <Text> {currencyFormat(parseFloat(item?.rate))}</Text>
              </Text>

              <Text h4>
                {currencyFormat(
                  parseFloat(item?.weight) * parseFloat(item?.rate),
                )}
              </Text>
              <Text h6>{dateFormat(item?.date)}</Text>
            </Animated.View>
            {item?.detail && (
              <Text entering={FadeInUp} h5 style={styles.detail}>
                {item.detail}
              </Text>
            )}
          </Pressable>
        ))
      ) : (
        <Text style={{ marginTop: 10 }}>{strings.no_record}</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...common.shadow,
    ...common.card,
    margin: '5%',
    marginVertical: 15,
    width: '90%',
  },
  row: {
    ...common.row_top_btw,
    width: '100%',
    marginTop: 20,
  },
  icon: {
    // position: 'absolute',
    // right: 20,
    // top: 20,
  },
  detail: {
    paddingTop: 10,
    fontStyle: 'italic',
  },
});

export default React.memo(PickerWeightDetail);
