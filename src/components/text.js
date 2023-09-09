import React from 'react';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, Text as TextRN } from 'react-native';
import { fonts, sizes } from 'src/utils/typograpy';
import { gray4, black as backRN, white as whiteRN, gray3 } from '../utils/color';

const Text = props => {
  const { colors } = useTheme();
  const {
    style,
    children,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    medium,
    bold,
    secondary,
    secondaryTitle,
    third,
    black,
    white,
    pl,
    pr,
    ...rest
  } = props;
  return (
    <TextRN
      {...rest}
      style={StyleSheet.flatten([
        StyleSheet.flatten([styles.text(backRN), style]),
        medium && styles.medium,
        bold && styles.bold,
        secondary && styles.color(gray4),
        secondaryTitle && styles.color(gray4),
        black && styles.color(backRN),
        white && styles.color(whiteRN),
        pl && styles.paddingLeft(pl),
        pr && styles.paddingRight(pr),
        third && styles.color(gray3),
        h5 && StyleSheet.flatten([styles.h5, style]),
        h1 && StyleSheet.flatten([styles.h1, style]),
        h2 && StyleSheet.flatten([styles.h2, style]),
        h3 && StyleSheet.flatten([styles.h3, style]),
        h4 && StyleSheet.flatten([styles.h4, style]),
        h6 && StyleSheet.flatten([styles.h6, style]),
      ])}>
      {children}
    </TextRN>
  );
};

const styles = {
  text: color => ({
    fontSize: sizes.base,
    textAlign: 'left',
    color,
  }),
  medium: {},
  bold: {},
  color: color => ({
    color,
  }),
  paddingLeft: pl => ({
    paddingLeft: pl,
  }),
  paddingRight: pr => ({
    paddingRight: pr,
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
};

export default Text;
