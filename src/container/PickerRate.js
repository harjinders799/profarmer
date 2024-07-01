import { View, StyleSheet } from 'react-native';
import React from 'react';
import { white } from 'src/utils/colors';
import Input from 'src/components/input';
import { strings } from 'src/translations/locale';

export default function PickerRate({ rate, setRate }) {
  return (
    <View style={styles.list}>
      <Input
        placeholder={strings.enter_rate + '(8,9,10,11 Rs)'}
        value={rate}
        setValue={setRate}
        keyboardType="numeric"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  list: {
    borderRadius: 10,
    backgroundColor: white,
    marginVertical: 10,
    width: '95%',
    alignSelf: 'center',
  },
});
