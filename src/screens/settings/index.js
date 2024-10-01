import {
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Account from './account';
import Text from 'src/components/text';
import { HEIGHT } from 'src/utils/constants';
import { useLang } from '../../context/langContext';
import Icon from '../../components/icon';
import { green, black, orange, white, gray3 } from '../../utils/colors';
import { strings } from '../../translations/locale';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { useAuth } from '../../context/authContext';
import NetInfo from '@react-native-community/netinfo';
import { ToastError, ToastProgress } from '../../utils/toast';
import Loader from '../../components/loader';
import More from '../more';
import { tabsData } from '../../utils/helper';
import Header from '@components/header';
import { navigate } from '@navigation/ref';
import { backupData } from '@network/labour-service';

const rnBiometrics = new ReactNativeBiometrics();

export default function Setting({ navigation }) {
  const { lang, setFingerLock, fingerLock, theme, setTheme } = useLang();
  const { user, reset } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => { }, [lang]);

  const onLogOut = async () => {
    try {
      setLoading(true);
      // let existWt = pickerWeight.some(o => o?.sync == 'pending');
      // let existEx = pickerExpense.some(o => o?.sync == 'pending');
      // if (existWt || existEx) {
      //   NetInfo.fetch().then(state => {
      //     if (state.isConnected && state.isInternetReachable) fetchData();
      //     else ToastError(strings.offline_warning);
      //   });
      //   setLoading(false);
      //   return;
      // } else {
      // resetPicker();
      reset();
      setLoading(false);
      // }
    } catch (error) {
      ToastError('Something Went Wrong!');
      setLoading(false);
    }
  };
  console.log(user);
  return (
    <BaseView space>
      <Loader visible={loading} />
      <Header
        back
        label={user?.name}
        rightComponent={
          <Icon
            type="FontAwesome5"
            name="user-edit"
            size={25}
            onPress={() => navigate('EditProfile')}
          />
        }
      />
      {/* <Account /> */}
      <ScrollView
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height: HEIGHT, paddingBottom: 200 }}>
        {/* <View style={{ flex: 1 }}>
          <More />
        </View> */}
        {/* <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {tabsData.slice(5).map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={{
                backgroundColor: orange,
                margin: 10,
                padding: 10,
                borderRadius: 10,
                width: '40%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => ToastProgress(strings.comming_soon)}>
              <Icon type={tab?.iconType} name={tab.icon} color={white} size={22} />
              <Text h4 style={{ color: white }}>
                {tab?.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('SalectLanguage')}>
            <Text style={styles.txt}>{strings.lang}</Text>
            <Icon name="chevron-right" type="Entypo" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('ContactUs')}>
            <Text style={styles.txt}>{strings.contact}</Text>
            <Icon name="chevron-right" type="Entypo" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('AboutUs')}>
            <Text style={styles.txt}>About Us</Text>
            <Icon name="chevron-right" type="Entypo" size={25} />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('AboutUs')}
          >
            <Text style={styles.txt}>Sync To Server</Text>
            <Icon name="cloudupload" size={25} />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              Share.share(
                {
                  title: 'ProFarmer App',
                  message: `नमस्कार! मैंने एक शानदार ऐप का उपयोग किया है जो 'चुगारे, श्रमिक, और आढ़तिया हिसाब' को सुविधाजनक बनाता है। यह मेरे किसान दोस्तों के लिए एक बड़े काम का है! 🌾👨‍🌾📊

'चुगारे, श्रमिक, और आढ़तिया हिसाब' ऐप के साथ, आप चुगारे और श्रमिकों की जानकारी को आसानी से रेकॉर्ड कर सकते हैं और हिसाब रख सकते हैं, साथ ही खेती से जुड़े महत्वपूर्ण डेटा को भी सहेज सकते हैं।

इस उपयोगकर्ता-मित्र ऐप को आप और आपके परिवार और दोस्तों के साथ साझा करें और सहायता करें। यहां है ऐप का डाउनलोड लिंक:

https://play.google.com/store/apps/details?id=com.profarmer

कृपया इस महत्वपूर्ण उपकरण को अपने सभी किसान दोस्तों के साथ साझा करें ताकि उन्हें भी इसके फायदे मिल सकें। 🌾📈
`,
                },
                {
                  dialogTitle: 'ProFarmer App',
                },
              )
            }>
            <Text style={styles.txt}>Share</Text>
            <Icon name="share" type="Entypo" size={25} />
          </TouchableOpacity>
          {/* {isBiometry ? (
          ) : null} */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => setTheme(theme == 'dark' ? 'light' : 'dark')}>
            <Text style={styles.txt}>
              {theme == 'light' ? 'Light' : 'Dark'} Theme
            </Text>
            <Switch
              value={theme == 'dark'}
              trackColor={{ false: gray3, true: gray3 }}
              thumbColor={theme == 'dark' ? white : black}
              onValueChange={() => setTheme(theme == 'dark' ? 'light' : 'dark')}
            />
          </TouchableOpacity>
          {user?.email == 'harjinders799@gmail.com' || __DEV__ ? (
            <TouchableOpacity
              style={styles.row}
              onPress={backupData}>
              <Text style={styles.txt}>Backup Now</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity style={styles.row} onPress={onLogOut}>
            <Text style={styles.txt}>Log Out</Text>
            <Icon name="logout" size={25} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BaseView>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingVertical: 10,
    marginBottom: 10,
  },
  txt: {
    fontSize: 20,
    fontWeight: '500',
    // color: black,
    // paddingVertical: 10,
  },
  footer: {
    borderRadius: 10,
    padding: 10,
    // marginTop: 30,
  },
});
