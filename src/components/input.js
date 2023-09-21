import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { WIDTH } from 'src/utils/constant';
import Icon from './icon';
import { black, gray3 } from '../utils/color';

const Input = ({
  style,
  refs,
  value,
  setValue,
  emailType,
  numberType,
  keyboardType,
  inputStyle,
  iconName = null,
  iconType = 'AntDesign',
  multiline = false,
  leftComponent = null,
  rightComponent = null,
  placeholder,
  placeholderColor,
  ...props
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { borderColor: gray3 }, style]}>
      {leftComponent}
      {iconName ? (
        <Icon
          name={iconName}
          type={iconType}
          size={20}
          // color={iconColor}
          style={{ margin: 10 }}
        />
      ) : null}
      <TextInput
        ref={refs}
        {...props}
        multiline={multiline}
        style={[styles.input, { color: black }, inputStyle]}
        value={value}
        onChangeText={text => setValue(text)}
        placeholder={placeholder}
        keyboardType={
          emailType ? 'email-address' : numberType ? 'phone-pad' : keyboardType
        }
        placeholderTextColor={placeholderColor ?? gray3}
      />
      {rightComponent}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 5,
  },
  input: {
    paddingHorizontal: 10,
    fontSize: 20,
    width: '100%',
  },
});

export default Input;
