import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import BaseView from 'src/container/base';
import Account from './account';
import Text from 'src/components/text';
import { strings } from 'src/translations/locale';
import { HEIGHT, WIDTH } from 'src/utils/constant';
import { useCotton } from 'src/context/cottonContext';
import { useLang } from '../../context/langContext';
import Icon from '../../components/icon';
import LanguagePicker from '../../components/languagePicker';

export default function Setting({ navigation }) {
  const { resetPicker } = useCotton();
  const { lang } = useLang();
  // const { user, reset } = useAuth();
  useEffect(() => { }, [lang]);

  return (
    <BaseView>
      <ScrollView
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height: HEIGHT, paddingBottom: 200 }}>

        <Account />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("SalectLanguage")}>
            <Text style={styles.txt}>Salect Language</Text>
            <Icon name='chevron-right' type="Entypo" size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("ContactUs")}>
            <Text style={styles.txt}>Contact Us</Text>
            <Icon name='chevron-right' type="Entypo" size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("AboutUs")}>
            <Text style={styles.txt}>About Us</Text>
            <Icon name='chevron-right' type="Entypo" size={25} />
          </TouchableOpacity>

          {/* <Biometrics /> */}

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
