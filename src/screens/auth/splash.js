import React, {useEffect} from 'react';
import {View, Image} from 'react-native';
import Logo from 'src/container/logo';
import {getAsyncStorage} from 'src/network/AsyncStorage';
import {Auth} from 'src/service/setup';
import {useCotton} from 'src/context/cottonContext';

export default function Splash({navigation}) {
  const {setPicker} = useCotton();

  useEffect(() => {
    getData();
    setTimeout(() => {
      try {
        let id = Auth().currentUser?.uid;
        navigation.replace(id ? 'Main' : 'Login');
      } catch (error) {
        navigation.replace('Login');
      }
    }, 2000);
  }, []);
  const getData = async () => {
    let data = JSON.parse(await getAsyncStorage('pickers'));
    if (Array.isArray(data) && data.length) setPicker(data);
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Logo splash={true} />
    </View>
  );
}
