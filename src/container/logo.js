import React from 'react';
import {Image, StatusBar, StyleSheet, View} from 'react-native';
import Text from 'src/components/text';
import {HEIGHT, WIDTH} from 'src/utils/constant';

const Logo = ({style, splash}) => (
  <Image
    source={require('../assets/logo.png')}
    style={[splash ? styles.splash : styles.logo, style]}
  />
);
const styles = StyleSheet.create({
  logo: {
    height: 180,
    width: 180,
    alignSelf: 'center',
  },
  splash: {
    height: HEIGHT,
    width: WIDTH,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
export default Logo;
