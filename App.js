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
import { orange } from 'src/utils/color';
import { AuthProvider } from './src/context/authContext';
import { AadtProvider } from './src/context/aadtContext';
import { LoanProvider } from './src/context/loanContext';
import { TimelineProvider } from './src/context/timeContext';
import firestore from '@react-native-firebase/firestore';
import { TabProvider } from './src/context/tabContext';
import { HarvestProvider } from './src/context/harvestContext';

export default function App() {
  const [version, setVersion] = useState();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    (async () => {
      const res = await checkVersion({
        platform: 'android',
      });
      setVersion(res);
      firestore().settings({
        persistence: true, // Enable offline persistence
        cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED
      });
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
        visible={__DEV__?false:(version?.needsUpdate ? true : false) && visible}
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
            <CottonProvider>
              <AadtProvider>
                <LoanProvider>
                  <TimelineProvider>
                  <HarvestProvider>
                    <LangProvider>
                      <Navigation />
                    </LangProvider>
                  </HarvestProvider>
                  </TimelineProvider>
                </LoanProvider>
              </AadtProvider>
            </CottonProvider>
          </StoreProvider>
        </AuthProvider>
      </TabProvider>
      <FlashMessage position="top" />
    </SafeAreaProvider>
  );
}
