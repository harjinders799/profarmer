import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from 'src/context/context';
import { CottonProvider } from 'src/context/cottonContext';
import FlashMessage from 'react-native-flash-message';
import Button from 'src/components/button';
import { checkVersion } from 'react-native-check-version';
import Text from 'src/components/text';
import { Linking, ScrollView, View } from 'react-native';
import { LangProvider } from 'src/context/langContext';
import { strings } from 'src/translations/locale';
import Navigation from 'src/navigation';
import Modal from 'src/components/Modal';
import { orange } from 'src/utils/colors';
import { AuthProvider } from './src/context/authContext';
import { AadtProvider } from './src/context/aadtContext';
import { TimelineProvider } from './src/context/timeContext';
import { TabProvider } from './src/context/tabContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth'
import { getFCMToken, saveTokenToFirestore } from '@network/auth-service';

export default function App() {
  const [version, setVersion] = useState();
  const [visible, setVisible] = useState(true);


  useEffect(() => {
    (async () => {
      const res = await checkVersion({
        platform: 'android',
      });
      setVersion(res);
    })();
    setTimeout(() => {
      setVisible(true);
    }, 15000);
  }, []);

  useEffect(() => {
    requestUserPermission()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Handle the message
      console.log('A new FCM message arrived!', remoteMessage);
    });
    if (auth()?.currentUser?.uid) {
      const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
        console.log('Token refreshed:', token);
        const userId = 'USER_ID_HERE'; // Replace with actual user ID
        await saveTokenToFirestore(token); // Update the token in Firestore
      });

      return unsubscribeTokenRefresh; // Cleanup the listener
    }

    return unsubscribe;
  }, [auth()?.currentUser?.uid]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      if (auth()?.currentUser?.uid) await getFCMToken();
    }
  }

  const update = () => {
    if (version?.url) Linking.openURL(version?.url);
  };
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Modal
          visible={(version?.needsUpdate ? true : false) && visible}
          setModalVisible={() => setVisible(false)}
          ratioHeight={0.9}>
          <ScrollView
            style={{
              width: '100%',
            }}
            contentContainerStyle={{
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingBottom: '30%',
            }}>
            <Button label="Update" btnStyle={{ marginTop: 0 }} onPress={update} />
            <Text h3>{strings.new_version}</Text>
          </ScrollView>
        </Modal>
        <TabProvider>
          <AuthProvider>
            <StoreProvider>
              {/* <CottonProvider> */}
              <AadtProvider>
                {/* <TimelineProvider> */}
                <LangProvider>
                  <Navigation />
                </LangProvider>
                {/* </TimelineProvider> */}
              </AadtProvider>
              {/* </CottonProvider> */}
            </StoreProvider>
          </AuthProvider>
        </TabProvider>
        <FlashMessage position="top" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
