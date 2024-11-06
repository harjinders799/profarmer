import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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
import { red, white } from '@utils/colors';
import { useTheme } from '@react-navigation/native';

const Header = ({
  label,
  leftComponent,
  back = false,
  share = false,
  more = false,
  deleteIcon = false,
  fullScreen = false,
  notification = false,
  notificationCount = 0,
  onSharePress = null,
  onDeletePress = null,
  onMorePress = null,
  rightComponent,
  style,
  txtStyle,
}) => {
  const { colors } = useTheme();

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
        {notification ? (
          <Pressable
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigate('Notifications')}>
            <Icon
              name={notificationCount ? 'bell-ring-outline' : 'bell-outline'}
              type="MaterialCommunityIcons"
              size={30}
              onPress={() => navigate('Notifications')}
            />
            {notificationCount ? (
              <Text color={white} h8 style={styles.notification}>
                {notificationCount < 100 ? notificationCount : '99+'}
              </Text>
            ) : null}
          </Pressable>
        ) : null}
        {more ? (
          <Icon
            name="more-vert"
            type="MaterialIcons"
            size={30}
            onPress={onMorePress}
          />
        ) : share || deleteIcon ? (
          <View
            style={[
              common.row_btw,
              {
                justifyContent:
                  deleteIcon && share ? 'space-between' : 'flex-end',
              },
            ]}>
            <Icon
              name="delete"
              type="MaterialCommunityIcons"
              size={30}
              color={red}
              onPress={onDeletePress}
              style={{ display: deleteIcon ? 'flex' : 'none', marginLeft: -10 }}
            />
            <Icon
              name="pdffile1"
              size={25}
              onPress={onSharePress}
              style={{ display: share ? 'flex' : 'none' }}
            />
          </View>
        ) : (
          null
        )}
        {rightComponent}
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
  notification: {
    position: 'absolute',
    backgroundColor: red,
    top: -5,
    right: -5,
    borderRadius: 10,
    width: 18,
    aspectRatio: 1,
    textAlign: 'center',
    lineHeight: 18,
    overflow: 'hidden',
  },
});
export default Header;
