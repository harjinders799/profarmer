import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Account from './account';
import Text from 'src/components/text';
import { HEIGHT } from 'src/utils/constant';
import { useCotton } from 'src/context/cottonContext';
import { useLang } from '../../context/langContext';
import Icon from '../../components/icon';
import { green, black } from '../../utils/color'
import { strings } from '../../translations/locale';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

const rnBiometrics = new ReactNativeBiometrics()

export default function Setting({ navigation }) {
  const { resetPicker } = useCotton();
  const { lang, setFingerLock, fingerLock } = useLang();
  const [isBiometry, setIsBiometry] = useState(false)
  // const { user, reset } = useAuth();
  useEffect(() => {
    (async () => {
      const { available } = await rnBiometrics.isSensorAvailable()
      setIsBiometry(available);
    })()

  }, [lang]);
  return (
    <BaseView>
      <ScrollView
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height: HEIGHT, paddingBottom: 200 }}>

        <Account />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("SalectLanguage")}>
            <Text style={styles.txt}>{strings.lang}</Text>
            <Icon name='chevron-right' type="Entypo" size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("ContactUs")}>
            <Text style={styles.txt}>{strings.contact}</Text>
            <Icon name='chevron-right' type="Entypo" size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("AboutUs")}>
            <Text style={styles.txt}>About Us</Text>
            <Icon name='chevron-right' type="Entypo" size={25} />
          </TouchableOpacity>
          {isBiometry ?
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("AboutUs")}>
              <Text style={styles.txt}>Finger Lock</Text>
              <Switch value={fingerLock}
                trackColor={{ false: '#767577', true: black }}
                thumbColor={fingerLock ? green : '#f4f3f4'}
                onValueChange={() => setFingerLock(!fingerLock)} />
            </TouchableOpacity>
            : null
          }

          <TouchableOpacity style={styles.row} onPress={async () => {
            resetPicker();
          }}>
            <Text style={styles.txt}>Log Out</Text>
            <Icon name='chevron-right' type="Entypo" size={25} />
          </TouchableOpacity>
        </View>
        {/* <View style={{flexDirection:'row',justifyContent:"space-between",backgroundColor:"green"}}>
<Entypo name='old-phone'size={50} />
<FontAwesome name='whatsapp'size={50} /> */}
        {/* </View> */}
      </ScrollView>
    </BaseView>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 10
  },
  txt: {
    fontSize: 20,
    fontWeight: '500',
    // color: black,
    paddingVertical: 10
  },
  footer: {
    // elevation: 3,
    // backgroundColor: white,
    borderRadius: 10,
    // margin: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
    // margin:100,

  },
});
