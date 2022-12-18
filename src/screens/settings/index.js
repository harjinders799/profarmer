import {Image, Linking, ScrollView, View} from 'react-native';
import React, {useEffect} from 'react';
import BaseView from 'src/container/base';
import Account from './account';
import Header from 'src/components/header';
import Profile from 'src/container/profile';
import Text from 'src/components/text';
import Button from 'src/components/button';
import {strings} from 'src/translations/locale';
import {HEIGHT} from 'src/utils/constant';
import {useCotton} from 'src/context/cottonContext';
import Auth from '@react-native-firebase/auth';
import LanguagePicker from '../../components/languagePicker';
import {useLang} from '../../context/langContext';

export default function Setting({navigation}) {
  const {resetPicker} = useCotton();
  const {lang} = useLang();
  useEffect(() => {}, [lang]);

  return (
    <BaseView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{height: HEIGHT, paddingBottom: 200}}>
        {/* <Account /> */}
        <LanguagePicker />

        {/* <Profile
                    style={{ alignSelf: 'center' }}
                    img={Auth()?.currentUser?.photoURL}
                    name={Auth()?.currentUser?.displayName}
                /> */}
        <Text h3>{`Hi Farmer \n\n${strings.compliment}`}</Text>
        <Text h4 style={{paddingTop: 20, textAlign: 'center'}}>
          {strings.compliment2}
        </Text>
        <Image
          source={require('../../assets/upi.png')}
          resizeMode="contain"
          style={{width: '100%', height: '25%'}}
        />
        <Button
          label={strings.contact}
          onPress={() =>
            Linking.openURL('https://api.whatsapp.com/send?phone=+919928185712')
          }
        />
        <Button
          label={' Log Out'}
          onPress={async () => {
            resetPicker();
          }}
        />
      </ScrollView>
    </BaseView>
  );
}
