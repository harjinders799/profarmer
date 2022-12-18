import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import BaseView from 'src/container/base';
import Input from 'src/components/input';
import Button from 'src/components/button';
import {F18, FBOLD} from 'src/utils/typograpy';
import {black, gray} from 'src/utils/color';
import {updateUser} from 'src/service/api';
import Loader from 'src/components/loader';
import Profile from 'src/container/profile';
import {Auth} from 'src/service/setup';

const Account = ({navigation}) => {
  const [user, setUser] = useState();
  const [isUpdate, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateData = (key, value) => {
    setUpdate(true);
    setUser({
      ...user,
      [key]: value,
    });
  };

  const update = async () => {
    try {
      setLoading(true);
      await updateUser(user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error);
    }
  };

  return (
    <>
      <Loader visible={loading} />
      <Profile
        style={{alignSelf: 'center'}}
        imgEdit
        img={user?.img?.uri ?? Auth().currentUser?.photoURL}
        name={user?.name}
        setImg={v => updateData('img', v)}
      />
      <Input value={user?.name} setValue={v => updateData('name', v)} />
      <Input
        value={user?.phone}
        keyboardType="phone-pad"
        setValue={v => updateData('phone', v)}
      />
      <Input
        keyboardType="email-address"
        value={user?.email}
        setValue={v => updateData('email', v)}
      />
      {isUpdate ? <Button label={'Update'} onPress={update} /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  txt: {
    marginTop: 20,
    fontSize: F18,
    fontWeight: FBOLD,
    color: black,
    // textDecorationLine: 'underline',
    backgroundColor: gray + 30,
    padding: 10,
  },
});

export default Account;
