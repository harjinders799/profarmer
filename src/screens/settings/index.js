import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import BaseView from '@container/base';
import Text from '@components/text';
import { HEIGHT, isIOS } from '@utils/constants';
import { useLang } from '@context/langContext';
import Icon from '@components/icon';
import { gray3, white, black, red } from '@utils/colors';
import { strings } from '@translations/locale';
import { useAuth } from '@context/authContext';
import Loader from '@components/loader';
import Header from '@components/header';
import { navigate } from '@navigation/ref';
import { backupData, backupUserData } from '@network/labour-service';
import { ToastError } from '@utils/toast';
import DeleteModal from '@container/deleteModal';
import auth from '@react-native-firebase/auth';

export default function Setting({ navigation }) {
  const { lang, setTheme, theme } = useLang();
  const { user, reset } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);

  useEffect(() => { }, [lang]);

  const onLogOut = useCallback(async () => {
    try {
      setLoading(true);
      reset();
    } catch (error) {
      ToastError(strings.somethingWentWrong);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  const handleShare = async () => {
    await Share.share(
      {
        title: 'ProFarmer App',
        message: strings.shareMessage,
      },
      {
        dialogTitle: 'ProFarmer App',
      },
    ).then((res) => {
      console.log(res);
    })
      .catch((err) => {
        err && console.log(err);
      });
  };

  const onBackupPress = async () => {
    try {
      setCreatingBackup(true);
      user?.email == 'harjinders799@gmail.com' || __DEV__
        ? await backupData()
        : await backupUserData();
    } catch (error) {
      ToastError(error?.message);
    } finally {
      setCreatingBackup(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true)
      // Get the current user's token
      const token = await auth().currentUser.getIdToken();

      // Prepare headers
      const headers = new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      // Prepare the request body
      const body = JSON.stringify({
        userId: auth().currentUser.uid,
      });

      // Make the API request
      const response = await fetch(
        'https://deleteuseranddata-ipdubtzi4q-uc.a.run.app',
        {
          method: 'POST',
          headers: headers,
          body: body,
        },
      );

      // Handle the response
      const result = await response.json();
      if (response.ok) {
        reset(); // Call reset function on success
      } else {
        ToastError(result?.error || strings.unknownError);
      }
    } catch (error) {
      ToastError(error?.message || strings.unknownError);
    } finally {
      setLoading(false)
    }
  };

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
      <ScrollView
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height: HEIGHT, paddingBottom: 200 }}>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigate('SelectLanguage')}>
            <Text style={styles.txt}>{strings.language}</Text>
            <Icon name="chevron-right" type="Entypo" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigate('ContactUs')}>
            <Text style={styles.txt}>{strings.contactUs}</Text>
            <Icon name="chevron-right" type="Entypo" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigate('AboutUs')}>
            <Text style={styles.txt}>{strings.aboutUs}</Text>
            <Icon name="chevron-right" type="Entypo" size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={handleShare}>
            <Text style={styles.txt}>{strings.share}</Text>
            <Icon name="share" type="Entypo" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Text style={styles.txt}>
              {theme === 'light' ? strings.lightTheme : strings.darkTheme}
            </Text>
            <Switch
              value={theme === 'dark'}
              trackColor={{ false: gray3, true: gray3 }}
              thumbColor={theme === 'dark' ? white : black}
              onValueChange={() =>
                setTheme(theme === 'dark' ? 'light' : 'dark')
              }
            />
          </TouchableOpacity>
          {isIOS ? null : <TouchableOpacity style={styles.row} onPress={onBackupPress}>
            <Text style={styles.txt}>Backup Now</Text>
            {creatingBackup ? (
              <ActivityIndicator />
            ) : (
              <Icon name="download" size={22} />
            )}
          </TouchableOpacity>}

          <TouchableOpacity style={styles.row} onPress={onLogOut}>
            <Text style={styles.txt}>{strings.logOut}</Text>
            <Icon name="logout" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => setOpenModal(true)}>
            <Text color={red} style={styles.txt}>
              {strings.delete_account}
            </Text>
            <Icon color={red} name="deleteuser" size={25} />
          </TouchableOpacity>
        </View>
        <DeleteModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          data={{}}
          loading={loading}
          customDescription={`${strings.alert_account_delete}`}
          onDelete={onDelete}
        />
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
  },
  footer: {
    borderRadius: 10,
    padding: 10,
  },
});
