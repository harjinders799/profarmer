import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { HEIGHT, WIDTH } from 'src/utils/constant';

const Loader = ({ size = 'large', small = false, color, visible, style }) => {
  const { colors } = useTheme();
  return visible ? (
    <ActivityIndicator
      size={size}
      color={color ? color : colors.text}
      style={[styles.loader, small && styles.small, { backgroundColor: small ? 'transparent' : colors.text + 10 }, style]}
    />
  ) : null;
};

const styles = StyleSheet.create({
  loader: {
    width: WIDTH,
    height: HEIGHT,
    position: 'absolute',
    zIndex: 99,
  },
  small: {
    width: 20,
    height: 20,
    position: 'relative',
  }
});
export default Loader;
