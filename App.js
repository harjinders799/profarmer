import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from 'src/context/context';
import FlashMessage from 'react-native-flash-message';
import Button from 'src/components/button';
import { checkVersion } from 'react-native-check-version';
import Text from 'src/components/text';
import { Linking, PermissionsAndroid, Platform, ScrollView, View } from 'react-native';
import { LangProvider } from 'src/context/langContext';
import { strings } from 'src/translations/locale';
import Navigation from 'src/navigation';
import Modal from 'src/components/Modal';
import { AuthProvider } from './src/context/authContext';
import { TabProvider } from './src/context/tabContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import { getFCMToken, saveTokenToFirestore } from '@network/auth-service';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { black } from '@utils/colors';
import { isIOS } from '@utils/constants';

export default function App() {
  const [version, setVersion] = useState();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await checkVersion({
        platform: Platform.OS,
        currentVersion: isIOS ? '1.0.4' : '2.2.7',
        bundleId: isIOS ? 'com.harjinder.profarmer' : 'com.profarmer',

      });
      setVersion(res);
    })();
    setTimeout(() => {
      setVisible(true);
    }, 15000);
  }, []);

  useEffect(() => {
    requestUserPermission();
    messaging()
      .subscribeToTopic('info')
      .then(() => console.log('Subscribed to topic!'));
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Handle the message
      console.log('A new FCM message arrived!', remoteMessage);
      onDisplayNotification(remoteMessage);
    });
    if (auth()?.currentUser?.uid) {
      const unsubscribeTokenRefresh = messaging().onTokenRefresh(
        async token => {
          console.log('Token refreshed:', token);
          await saveTokenToFirestore(token); // Update the token in Firestore
        },
      );

      return unsubscribeTokenRefresh; // Cleanup the listener
    }

    return unsubscribe;
  }, [auth()?.currentUser?.uid]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission({ sound: true, provisional: true, badge: true });
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log(enabled, 'Authorization status:', authStatus);
    if (enabled) {
      if (auth()?.currentUser?.uid) await getFCMToken();
    }
  }
  async function onDisplayNotification(data) {
    // if (isIOS) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();
    // }
    // else {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
    // }
    console.log({ channelId, data });
    // Display a notification
    await notifee.displayNotification({
      title: data?.notification?.title,
      body: data?.notification?.body,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        color: '#CD853F',
        smallIcon: 'ic_notification', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
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
              <LangProvider>
                <MenuProvider customStyles={{
                  backdrop: {
                    backgroundColor: black,
                    opacity: 0.5,
                  }
                }}>
                  <Navigation />
                </MenuProvider>
              </LangProvider>
            </StoreProvider>
          </AuthProvider>
        </TabProvider>
        <FlashMessage position="top" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
