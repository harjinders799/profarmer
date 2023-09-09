import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { WIDTH } from 'src/utils/constant';
import Text from './text';
import Icon from './icon';
import { green } from '../utils/color';

const Button = ({
  btnStyle,
  txtStyle,
  iconName = null,
  iconType = 'AntDesign',
  iconColor,
  label,
  onPress,
  ...props
}) => (
  <TouchableOpacity {...props} style={[styles.container, btnStyle]} onPress={onPress}>
    {iconName ? (
      <Icon
        name={iconName}
        type={iconType}
        size={20}
        color={iconColor}
        style={{ marginRight: 10 }}
      />
    ) : null}
    <Text h4 medium white style={txtStyle}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: WIDTH / 1.2,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: green,
    marginVertical: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Button;
