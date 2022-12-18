import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {blue, white} from 'src/utils/color';
import {WIDTH} from 'src/utils/constant';
import Text from './text';

const Button = ({btnStyle, txtStyle, label, onPress}) => (
  <TouchableOpacity style={[styles.container, btnStyle]} onPress={onPress}>
    <Text h3 medium white style={txtStyle}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: WIDTH / 1.2,
    alignSelf: 'center',
    backgroundColor: blue,
    marginVertical: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Button;
