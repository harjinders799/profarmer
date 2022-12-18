import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from './text';
import {commonStyle} from '../utils/style';
import {useTheme} from '@react-navigation/native';
import Icon from './icon';

export default function Checkbox({isChecked, onPress, label}) {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={commonStyle.row_c_j_l}>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          padding: 2,
          width: 25,
          height: 25,
          borderRadius: 10,
          overflow: 'hidden',
          marginRight: 15,
        }}>
        {isChecked ? (
          <Icon name="check" color={colors.primary} size={20} />
        ) : null}
      </View>
      <Text h3>{label}</Text>
    </TouchableOpacity>
  );
}
