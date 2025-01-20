import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StoreProvider} from 'src/context/context';
import FlashMessage from 'react-native-flash-message';
import Button from 'src/components/button';
import {checkVersion, VersionInfo} from 'react-native-check-version';
import Text from 'src/components/text';
import {
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {LangProvider} from 'src/context/langContext';
import {strings} from 'src/translations/locale';
import Navigation from 'src/navigation';
import Modal from 'src/components/Modal';
import {AuthProvider} from './src/context/authContext';
import {TabProvider} from './src/context/tabContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import {getFCMToken, saveTokenToFirestore} from '@network/auth-service';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {MenuProvider} from 'react-native-popup-menu';
import {black} from '@utils/colors';
import {isIOS} from '@utils/constants';
import {
  handleIncomingMessage,
  handleTokenRefresh,
  requestUserPermission,
  setupBackgroundEventListener,
  setupForegroundEventListener,
  subscribeToTopics,
} from '@utils/notification';
import 'react-native-gesture-handler';
import {CropTrackerProvider} from '@context/cropTrackerContext';

const App: React.FC = () => {
  const [version, setVersion] = useState<VersionInfo | null>(null);
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const res = await checkVersion({
        platform: Platform.OS,
        currentVersion: isIOS ? '1.0.8' : '2.3.3',
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
    subscribeToTopics();

    const unsubscribeOnMessage = messaging().onMessage(handleIncomingMessage);

    if (auth()?.currentUser?.uid) {
      const unsubscribeTokenRefresh =
        messaging().onTokenRefresh(handleTokenRefresh);
      const foregroundEventListener = setupForegroundEventListener();
      const backgroundEventListener = setupBackgroundEventListener();

      // Cleanup on component unmount
      return () => {
        unsubscribeOnMessage();
        unsubscribeTokenRefresh();
        foregroundEventListener();
        if (backgroundEventListener) backgroundEventListener();
      };
    }

    // Cleanup when the component is unmounted
    return () => unsubscribeOnMessage();
  }, [auth()?.currentUser?.uid]);

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
            <Button label="Update" btnStyle={{marginTop: 0}} onPress={update} />
            <Text h3>{strings.new_version}</Text>
          </ScrollView>
        </Modal>
        <TabProvider>
          <AuthProvider>
            <StoreProvider>
              <LangProvider>
                <MenuProvider
                  customStyles={{
                    backdrop: {
                      backgroundColor: black,
                      opacity: 0.5,
                    },
                  }}>
                  <CropTrackerProvider>
                    <Navigation />
                  </CropTrackerProvider>
                </MenuProvider>
              </LangProvider>
            </StoreProvider>
          </AuthProvider>
        </TabProvider>
        <FlashMessage position="top" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
