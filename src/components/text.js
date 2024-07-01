import React from 'react';
import { StyleSheet } from 'react-native';
import { sizes } from '@utils/fonts';
import Animated from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';

const Text = ({
  children = '',
  h1 = false,
  h2 = false,
  h3 = false,
  h4 = false,
  h5 = false,
  h6 = false,
  h7 = false,
  h8 = false,
  medium = false,
  bold = false,
  semi = false,
  center = false,
  left = false,
  right = false,
  style = {},
  color,
  ...rest
}) => {
  const { colors } = useTheme();
  color = color ? color : colors.text;
  return (
    <Animated.Text
      {...rest}
      allowFontScaling={false}
      style={StyleSheet.flatten([
        StyleSheet.flatten([styles.text, style]),
        color && styles.color(color),
        medium && { fontWeight: '700' },
        bold && { fontWeight: 'bold' },
        semi && { fontWeight: '500' },
        center && { textAlign: 'center' },
        left && { textAlign: 'left' },
        right && { textAlign: 'right' },
        h1 && StyleSheet.flatten([styles.h1, style]),
        h2 && StyleSheet.flatten([styles.h2, style]),
        h3 && StyleSheet.flatten([styles.h3, style]),
        h4 && StyleSheet.flatten([styles.h4, style]),
        h5 && StyleSheet.flatten([styles.h5, style]),
        h6 && StyleSheet.flatten([styles.h6, style]),
        h7 && StyleSheet.flatten([styles.h7, style]),
        h8 && StyleSheet.flatten([styles.h8, style]),
      ])}>
      {children}
    </Animated.Text>
  );
};

const styles = {
  text: {
    fontSize: sizes.base,
    textAlign: 'left',
  },
  color: color => ({
    color,
  }),
  h1: {
    fontSize: sizes.h1,
  },
  h2: {
    fontSize: sizes.h2,
  },
  h3: {
    fontSize: sizes.h3,
  },
  h4: {
    fontSize: sizes.h4,
  },
  h5: {
    fontSize: sizes.h5,
  },
  h6: {
    fontSize: sizes.h6,
  },
  h7: {
    fontSize: sizes.h7,
  },
  h8: {
    fontSize: sizes.h8,
  },
};
export default Text;
