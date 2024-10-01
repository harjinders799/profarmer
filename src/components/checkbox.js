import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import Text from './text';
import { common, } from '@utils/style';
import { useTheme } from '@react-navigation/native';
import Icon from './icon';

export default function Checkbox({ isChecked, onPress, label, style, activeColor, disabled = false }) {
  const { colors } = useTheme();
  activeColor = activeColor ?? colors.primary
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[common.row_start, style]}
      disabled={disabled}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          width: 20,
          height: 20,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 15,
        }}>
        {isChecked ? (
          // <Icon name="check" color={colors.primary} size={20} />
          <View
            style={{
              backgroundColor: activeColor,
              width: 15,
              height: 15,
              borderRadius: 3,
            }} />
        ) : null}
      </View>
      <Text h4 color={isChecked ? activeColor : colors.text}>{label}</Text>
    </TouchableOpacity>
  );
}
