import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import Logo from 'src/container/logo';
import auth from '@react-native-firebase/auth';

export default function Splash({ navigation }) {

  useEffect(() => {
    setTimeout(() => {
      try {
        let id = auth().currentUser?.uid;
        navigation.replace(id ? 'Main' : 'Login');
      } catch (error) {
        navigation.replace('Login');
      }
    }, 2000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Logo splash={true} />
    </View>
  );
}
