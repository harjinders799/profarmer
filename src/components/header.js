import {View, Text} from 'react-native';
import React from 'react';
import {commonStyle} from 'src/utils/style';

export default function Header({
  style,
  leftComponent,
  centerComponent,
  rightComponent,
}) {
  return (
    <View style={[commonStyle.row_c_j_b, style]}>
      {leftComponent}
      {centerComponent}
      {rightComponent}
    </View>
  );
}
