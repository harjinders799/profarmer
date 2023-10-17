import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import BaseView from 'src/container/base';
import Input from 'src/components/input';
import Button from 'src/components/button';
import { F18, FBOLD } from 'src/utils/typograpy';
import { black, gray } from 'src/utils/color';
import Loader from 'src/components/loader';
import Profile from 'src/container/profile';
import { Auth } from 'src/service/setup';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Text from '../../components/text';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/authContext';
import { green, red } from '../../utils/color';
import { strings } from '../../translations/locale';
import { commonStyle } from '../../utils/style';

const Account = ({ }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  // console.log(user)
  let userData = [
    {
      icon: 'user',
      lable: strings.name,
      value: user?.name && user?.name.trim() != '' ? user?.name : '--',
    },
    {
      icon: 'phone',
      lable: strings.phone,
      value: user?.phone && user?.phone.trim() != '' ? user?.phone : '--',
    },
    {
      icon: 'mail',
      lable: strings.email,
      value: user?.email && user?.email.trim() != '' ? user?.email : '--',
    },
  ];
  return (
    <View style={[commonStyle.row_c_j_b, commonStyle.m_v_10]}>
      <Profile
        // style={{ alignSelf: 'center' }}
        small
        img={user?.img?.uri ?? Auth().currentUser?.photoURL}
        name={user?.name}
        setImg={v => updateData('img', v)}
      />
      <Text h2 style={styles.txt}>
        {user?.name}
      </Text>
      <TouchableOpacity
        style={styles.headericon}
        onPress={() => navigation.navigate('EditProfile')}>
        <FontAwesome5Icon
          name="user-edit"
          color={black}
          size={25}
          onPress={() => navigation.navigate('EditProfile')}
        />
      </TouchableOpacity>
      {/* <View style={styles.header}>
        {userData.map((v, i) => (
          <View key={i} style={[styles.row]}>
            <Feather name={v?.icon} size={20} style={styles.icon} />
            <View style={styles.rightbox}>
              <Text >{v?.lable}</Text>
              <Text >{v?.value}</Text>
            </View>
          </View>
        ))}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  txt: {
    fontWeight: 'bold',
  },
  headericon: {
    // position: 'absolute',
    // right: 20,
    // top: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  header: {
    paddingVertical: 20,
  },
  rightbox: {
    width: '80%',
    marginLeft: 10,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
  },
  icon: {
    // paddingRight: 20,
    padding: 10,
    backgroundColor: green + 20,
    borderRadius: 20,
  },
});

export default Account;
