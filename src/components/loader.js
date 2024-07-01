import React from 'react';
import { ActivityIndicator, View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    zIndex: 99,
    height: '100%',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    zIndex: 99,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Loader = ({ visible, small = false, style }) => {
  const { colors } = useTheme();
  return visible ? (
    <View
      style={[
        small ? styles.small : styles.container,
        { backgroundColor: colors.background + 30 },
        style,
      ]}>
      <ActivityIndicator
        size="large"
        animating={visible}
        color={colors.text}
        style={{
          left: Platform.OS === 'ios' ? 1 : 0,
          top: Platform.OS === 'ios' ? 1 : 0,
        }}
      />
    </View>
  ) : null;
};

export default Loader;
