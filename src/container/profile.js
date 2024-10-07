import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { black, blue, white } from '../utils/colors';
import { WIDTH } from '../utils/constants';
import { useTheme } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { common } from '@utils/style';
import Icon from '@components/icon';
import { ToastProgress } from '@utils/toast';
import { strings } from '@translations/locale';

export default ({
  small,
  style,
  img = auth()?.currentUser?.photoURL,
  name = auth()?.currentUser?.displayName,
  onImgTap,
  imgEdit,
}) => {
  const { colors } = useTheme();

  const onEditImgTap = () => { ToastProgress(strings.in_progress) };
  return (
    <View style={[styles.container, small && styles.small, style]}>
      <View style={styles.imgContainer}>
        <TouchableOpacity onPress={onImgTap} activeOpacity={0.8}>
          {img ? (
            <Image source={{ uri: img }} style={styles.img} resizeMode="cover" />
          ) : (
            <View style={[styles.img, { backgroundColor: colors.border }]}>
              <Text style={[styles.name, small && { fontSize: 30 }]}>
                {name ? name.charAt(0) : '😊'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {/* {imgEdit ? (
        <View
          style={[
            styles.editImgContainer,
            { backgroundColor: colors.background },
          ]}>
          <Icon
            name="camera"
            type="Feather"
            size={16}
            onPress={onEditImgTap}
            color={colors.text}
          />
        </View>
      ) : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    width: WIDTH / 3,
    height: WIDTH / 3,
  },
  small: {
    padding: 1,
    width: 50,
    margin: 2,
    height: 50,
  },
  imgContainer: {
    height: '100%',
    width: '100%',
    borderRadius: 100,
    overflow: 'hidden',
  },
  img: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: '75%'
  },
  editImgContainer: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    position: 'absolute',
    bottom: 0,
    zIndex: 99,
    ...common.shadow,
  },
  name: {
    color: black,
    fontSize: 50,
    fontWeight: 'bold',
  },
});
