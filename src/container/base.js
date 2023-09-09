import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import AdBanner from 'src/components/adBanner';
import Icon from 'src/components/icon';
import { orange } from 'src/utils/color';
import { commonStyle } from 'src/utils/style';
import { darkOrange, green, white } from '../utils/color';

const BaseView = ({ style, addBtn, onPress, children }) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        commonStyle.centerAligned,
        commonStyle.p_h_20,
        styles.base,
        { backgroundColor: white },
        style,
      ]}>
      <StatusBar backgroundColor={green} barStyle="light-content" />
      {children}
      {addBtn ? (
        <TouchableOpacity
          style={[
            commonStyle.centerAlignedJustify,
            styles.icon,
            { backgroundColor: colors.primary },
          ]}
          onPress={onPress}>
          <Icon
            name="plus"
            size={30}
            color={white}
            onPress={onPress}
          />
        </TouchableOpacity>
      ) : null}

      {/* {addBtn ? <AdBanner /> : null} */}
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
