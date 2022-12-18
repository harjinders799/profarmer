import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Button from 'src/components/button';
import {strings} from 'src/translations/locale';
import {useTheme} from '@react-navigation/native';
import Text from 'src/components/text';

export default function FilterTab({arr, active, setActive}) {
  const {colors} = useTheme();
  return arr.length ? (
    <View style={{marginVertical: 15}}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor:
                active == 'date' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setActive('date')}>
          <Text white={active == 'date'} h3>
            {strings.date}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor:
                active == 'picker' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setActive('picker')}>
          <Text white={active == 'picker'} h3>
            {strings.pickers}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.row, {marginTop: 3}]}>
        <View
          style={[
            styles.tab,
            {
              backgroundColor:
                active == 'date' ? colors.primary : colors.border,
            },
          ]}
        />
        <View
          style={[
            styles.tab,
            {
              backgroundColor:
                active == 'picker' ? colors.primary : colors.border,
            },
          ]}
        />
      </View>
    </View>
  ) : null;
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btn: {
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab: {
    width: '50%',
    height: 5,
  },
});
