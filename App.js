import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StoreProvider } from 'src/context/context'
import { CottonProvider } from 'src/context/cottonContext'
import FlashMessage from 'react-native-flash-message';
import Button from 'src/components/button'
import { checkVersion } from "react-native-check-version";
import Text from 'src/components/text'
import { Linking, View } from 'react-native'
import { LangProvider } from 'src/context/langContext'
import { strings } from 'src/translations/locale'
import Navigation from 'src/navigation';


export default function App() {
  const [version, setVersion] = useState();
  useEffect(() => {
    (async () => {
      const version = await checkVersion({
        platform: 'android',
      });
      setVersion(version);

    })();
  }, []);

  const update = () => {
    if (version?.url) Linking.openURL(version?.url)
  }

  return (
    <SafeAreaProvider>
      {/* {
        version?.needsUpdate &&
        <View style={{ alignItems: 'center' }}>
          <Text>
            {strings.new_version}
          </Text>
          <Button
            label='Update'
            onPress={update}
          />
        </View>
      } */}
      <StoreProvider>
        <CottonProvider>
          <LangProvider>
            <Navigation />
          </LangProvider>
        </CottonProvider>
      </StoreProvider>
      <FlashMessage position="top" />
    </SafeAreaProvider>
  )
}