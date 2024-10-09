import React, { useState } from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { LOGO, WIDTH } from '@utils/constants';
import { useTheme } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { common } from '@utils/style';
import Icon from '@components/icon';
import Loader from '@components/loader';
import Text from '@components/text';

export default ({
  small,
  style,
  img = auth()?.currentUser?.photoURL,
  name = auth()?.currentUser?.displayName,
  onEditImgTap,
  imgEdit,
}) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.container, small && styles.small, style]}>
      <View style={styles.imgContainer}>
        <TouchableOpacity onPress={onEditImgTap} activeOpacity={0.8}>
          <Loader visible={loading && !!img} small />
          {img ? (
            <Image
              // source={{ uri: typeof img == 'string' ? img : img?.uri }}
              source={{
                uri: loading ? LOGO : typeof img === 'string' ? img : img?.uri,
              }}
              style={styles.img}
              onLoad={() => setLoading(false)}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.img, { backgroundColor: colors.disable }]}>
              <Text style={[styles.name, small && { fontSize: 30 }]}>
                {name ? name.charAt(0) : '😊'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {imgEdit ? (
        <TouchableOpacity
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
        </TouchableOpacity>
      ) : null}
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
    fontSize: 50,
    fontWeight: 'bold',
  },
});
