import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StoreProvider} from 'src/context/context';
import {CottonProvider} from 'src/context/cottonContext';
import FlashMessage from 'react-native-flash-message';
import Button from 'src/components/button';
import {checkVersion} from 'react-native-check-version';
import Text from 'src/components/text';
import {Linking, View} from 'react-native';
import {LangProvider} from 'src/context/langContext';
import {strings} from 'src/translations/locale';
import Navigation from 'src/navigation';
import Modal from 'src/components/Modal';
import {orange} from 'src/utils/color';

export default function App() {
  const [version, setVersion] = useState();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    (async () => {
      const res = await checkVersion({
        platform: 'android',
      });
      setVersion(res);
    })();
    setTimeout(() => {
      setVisible(true);
    }, 3000);
  }, []);

  const update = () => {
    if (version?.url) Linking.openURL(version?.url);
  };

  return (
    <SafeAreaProvider>
      <Modal
        visible={version?.needsUpdate && visible}
        setModalVisible={() => setVisible(false)}
        ratioHeight={0.7}>
        <View
          style={{
            alignItems: 'center',
            padding: 20,
            backgroundColor: orange,
          }}>
          <Text>{strings.new_version}</Text>
          <Button label="Update" onPress={update} />
        </View>
      </Modal>
      <StoreProvider>
        <CottonProvider>
          <LangProvider>
            <Navigation />
          </LangProvider>
        </CottonProvider>
      </StoreProvider>
      <FlashMessage position="top" />
    </SafeAreaProvider>
  );
}
