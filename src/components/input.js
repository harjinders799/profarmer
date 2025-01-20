import { useTheme } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Icon from './icon';
import Text from './text';
import Animated from 'react-native-reanimated';
import { hp, sizes } from '@utils/fonts';

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
  const [inputHeight, setInputHeight] = useState(45);

  const handleChange = useCallback((value) => {
    setValue(value);

    // Calculate the height based on content
    const lines = value.split('\n').length; // Count number of lines
    const newHeight = Math.min(40 + lines * 20, 150); // Calculate new height, max 200
    setInputHeight(newHeight);
  }, [value]);

  return (
    <Animated.View {...props} style={[styles.container, style]}>
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
          style={[styles.input, { color: colors.text, maxHeight: inputHeight }, inputStyle]}
          value={value}
          selectionColor={colors.primary}
          onChangeText={text => multiline ? handleChange(text) : setValue(text)}
          placeholder={placeholder}
          keyboardType={
            emailType
              ? 'email-address'
              : numberType
                ? 'numeric'
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
    minHeight: 45,
    textAlignVertical: 'center',
    // paddingVertical: hp(1),
    paddingHorizontal: 10,
    fontSize: sizes.h4,
    width: '100%',
  },
  label: {
    margin: 5,
  },
});

export default Input;
