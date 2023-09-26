import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from 'src/context/context';
import { CottonProvider } from 'src/context/cottonContext';
import FlashMessage from 'react-native-flash-message';
import Button from 'src/components/button';
import { checkVersion } from 'react-native-check-version';
import Text from 'src/components/text';
import { Linking, View } from 'react-native';
import { LangProvider } from 'src/context/langContext';
import { strings } from 'src/translations/locale';
import Navigation from 'src/navigation';
import Modal from 'src/components/Modal';
import { orange } from 'src/utils/color';
import { AuthProvider } from './src/context/authContext';
import { AadtProvider } from './src/context/aadtContext';

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

  const update = () => {
    if (version?.url) Linking.openURL(version?.url);
  };
  return (
    <SafeAreaProvider>
      <Modal
        visible={(version?.needsUpdate ? true : false) && visible}
        setModalVisible={() => setVisible(false)}
        ratioHeight={0.9}>
        <View
          style={{
            alignItems: 'center',
            padding: 20,
          }}>
          <Text h3>{strings.new_version}</Text>
          <Button label="Update" onPress={update} />
        </View>
      </Modal>
      <AuthProvider>
        <StoreProvider>
          <CottonProvider>
            <AadtProvider>
              <LangProvider>
                <Navigation />
              </LangProvider>
            </AadtProvider>
          </CottonProvider>
        </StoreProvider>
      </AuthProvider>
      <FlashMessage position="top" />
    </SafeAreaProvider>
  );
}
