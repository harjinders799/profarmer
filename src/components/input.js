import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Icon from './icon';
import { borderLight } from '@utils/colors';
import Text from './text';
import Animated from 'react-native-reanimated';
import { sizes } from '@utils/fonts';

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
  label,
  innerStyle,
  ...props
}) => {
  const { colors } = useTheme();
  return (
    <Animated.View {...props} style={[styles.container, { borderColor: colors.border }, style]}>
      {label ? <Text h4 style={styles.label}>{label}</Text> : null}

      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            width: '100%',
            borderRadius: 10,
            borderColor: colors.border,
            overflow: 'hidden'
          },
          innerStyle,
        ]}>
        {leftComponent}

        {iconName ? (
          <Icon
            name={iconName}
            type={iconType}
            size={20}
            style={{ margin: 10 }}
          />
        ) : null}
        <TextInput
          ref={refs}
          {...props}
          allowFontScaling={false}
          multiline={multiline}
          style={[styles.input, { color: colors.text }, inputStyle]}
          value={value}
          onChangeText={text => setValue(text)}
          placeholder={placeholder}
          keyboardType={
            emailType
              ? 'email-address'
              : numberType
                ? 'phone-pad'
                : keyboardType
          }
          placeholderTextColor={colors.border}
        />
        {rightComponent}
      </View>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    // height: 50,
    width: '100%',
    marginVertical: 5,
  },
  input: {
    // height: 50,
    paddingHorizontal: 10,
    fontSize: sizes.h3,
    width: '100%',
  },
  label: {
    margin: 5,
  },
});

export default Input;
