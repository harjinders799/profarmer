import React, { memo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from './icon';
import Text from './text';
import { common } from '@utils/style';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { white } from '@utils/colors';

// Memoize Button component to prevent unnecessary re-renders
// export const MemoizedButton = memo(Button);

const Button = ({
  btnStyle,
  txtStyle,
  label,
  loading = false,
  txtColor = undefined,
  iconRight = null,
  iconLeft = null,
  iconType,
  small = false,
  rightComponent = null,
  onPress,
  disabled,
  ...props
}) => {
  const { colors } = useTheme();
  txtColor = txtColor ? txtColor : white;
  return (
    <Animated.View
      entering={FadeInUp}
      style={[
        styles.container,
        small && styles.small,
        {
          backgroundColor:
            loading || disabled ? colors.disable : colors.primary,
        },
        btnStyle,
      ]}
      {...props}>
      <TouchableOpacity
        disabled={loading || disabled}
        style={[common.row_center, common.full_h_W]}
        activeOpacity={0.4}
        onPress={onPress}>
        {loading ? (
          <ActivityIndicator size={25} color={colors.text} />
        ) : (
          <View style={[common.row_center]}>
            {iconLeft ? (
              <Icon
                name={iconLeft}
                type={iconType}
                size={small ? 14 : 20}
                color={txtColor}
              />
            ) : null}
            {label ? <Text
              color={txtColor}
              h5={!small}
              bold={!small}
              semi={small}
              style={[
                {
                  marginRight: iconRight ? 10 : 0,
                  marginLeft: iconLeft ? 10 : 0,
                },
                txtStyle,
              ]}>
              {label}
            </Text> : null}
            {iconRight ? (
              <Icon
                name={iconRight}
                type={iconType}
                size={20}
                color={txtColor ? txtColor : colors.background}
              />
            ) : null}
            {rightComponent}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    marginVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  small: {
    height: 30,
    width: '30%',
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
export default Button;
