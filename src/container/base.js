import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { common } from 'src/utils/style';
import { WIDTH, isIOS } from '../utils/constants';

const BaseView = ({ style, space = false, children }) => {
  const { colors, dark } = useTheme();
  return (
    <View
      style={[
        common.centerAligned,
        styles.base,
        { backgroundColor: colors.background },
        space && { paddingHorizontal: 20 },
        style,
      ]}>
      {isIOS ? (
        <View
          style={{
            backgroundColor: colors.background,
            height: 50,
            width: WIDTH,
          }}>
          <StatusBar
            backgroundColor={colors.background}
            barStyle={dark ? 'light-content' : 'dark-content'}
          />
        </View>
      ) : (
        <StatusBar
          backgroundColor={colors.background}
          barStyle={dark ? 'light-content' : 'dark-content'}
        />
      )}
      {children}
    </View>
  );
};
const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    elevation: 3,
    position: 'absolute',
    right: 30,
    bottom: 100,
    zIndex: 99,
  },
});
export default BaseView;
