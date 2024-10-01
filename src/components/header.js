import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from './text';
import { common } from '@utils/style';
import { wp } from '@utils/fonts';
import Icon from './icon';
import { goBack, navigate } from 'src/navigation/ref';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from 'react-native-reanimated';
import { red } from '@utils/colors';

const Header = ({
  label,
  leftComponent,
  back = false,
  share = false,
  deleteIcon = false,
  fullScreen = false,
  onSharePress = null,
  onDeletePress = null,
  rightComponent,
  style,
  txtStyle,
}) => {
  return (
    <View
      style={[
        common.row_btw,
        styles.container,
        fullScreen && { paddingHorizontal: 0, width: wp(90) },
        style,
      ]}>
      <Animated.View
        style={{ width: '15%' }}
        entering={FadeInLeft.delay(100).duration(500)}
        exiting={FadeInLeft.delay(100).duration(500)}>
        {back ? (
          <Icon
            name={'chevron-back'}
            type="Ionicons"
            size={25}
            onPress={goBack}
          />
        ) : (
          leftComponent
        )}
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(100).duration(500)}
        exiting={FadeInUp.delay(100).duration(500)}
        style={{ width: '70%', alignItems: 'center' }}>
        {
          <Text
            numberOfLines={1}
            h3
            bold
            center
            style={[{ width: '100%' }, txtStyle]}>
            {label}
          </Text>
        }
      </Animated.View>
      <Animated.View
        style={{ width: '15%', alignItems: 'flex-end' }}
        entering={FadeInRight.delay(100).duration(500)}
        exiting={FadeInRight.delay(100).duration(500)}>
        {share || deleteIcon ? (
          <View
            style={[
              common.row_btw,
              { justifyContent: deleteIcon && share ? 'space-between' : 'flex-end' },
            ]}>
            <Icon
              name="delete"
              type="MaterialCommunityIcons"
              size={30}
              color={red}
              onPress={onDeletePress}
              style={{ display: deleteIcon ? 'flex' : 'none', marginLeft: -10 }}
            />
            <Icon name="pdffile1" size={25} onPress={onSharePress} style={{ display: share ? 'flex' : 'none' }} />
          </View>
        ) : (
          rightComponent
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    padding: 10,
    zIndex: 1,
  },
});
export default Header
