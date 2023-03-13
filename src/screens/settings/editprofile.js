import { ScrollView, StyleSheet, View } from 'react-native';
import Button from '../../components/button';
import Input from 'src/components/input';
import { useAuth } from '../../context/authContext';
import Text from '../../components/text';
import Loader from 'src/components/loader';
import BaseView from 'src/container/base';
import Profile from 'src/container/profile';
import { Auth } from 'src/service/setup';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import React, { useEffect } from 'react';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { goBack } from '../../navigation/ref';
import { useTheme } from '@react-navigation/native';
import { UpdateUser } from '../../network/auth-service';

export default function EditProfile({ navigation }) {
    const { user: data, getUser } = useAuth();
    const { colors } = useTheme();
    const [loading, setLoading] = React.useState(false);
    const [user, setUser] = React.useState({
        name: data?.name ?? '',
        phone: data?.phone ?? Auth().currentUser?.phoneNumber ?? '',
        email: data?.email ?? Auth().currentUser?.email,
        // img: data?.profile ?? '',
    });

    const { name, email, phone } = user;
    const updateData = (key, value) => {
        setUser({
            ...user,
            [key]: value,
        });
    };
    const update = async () => {
        if (!user?.name) ToastError('Please Fill Name', 'Profile');
        else if (!user?.phone || user?.phone.length < 10)
            ToastError('Please Fill Valid Phone Number', 'Profile');
        else {
            try {
                setLoading(true);
                await UpdateUser(user);
                console.log('---------------');
                ToastSuccess('Successfully updated!', 'Profile');
                console.log('-----save------');
                getUser();
                navigation.goBack();
                setLoading(false);
            } catch (error) {
                setLoading(false);
                ToastError(error?.message, 'Profile');
            }
        }
    };
    return (
        <BaseView>
            <Loader visible={loading} />
            <Header
                leftComponent={
                    <Icon
                        name="back"
                        size={28}
                        color={colors.text}
                        onPress={() => goBack()}
                    />
                }
                centerComponent={<Text h2>{"Profile"}</Text>}
                rightComponent={<Text h2> </Text>}
            />
            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                {/* <Profile
                    size={150}
                    style={{ alignSelf: 'center' }}
                    imgEdit
                    img={img}
                    setImg={v => updateData('img', v)}
                    name={name}
                /> */}
                <View style={styles.body}>
                    <Input
                        placeholder="Name"
                        value={name} setValue={v => updateData('name', v)} />
                    <Input
                        value={phone}
                        placeholder="Phone"
                        keyboardType="phone-pad"
                        setValue={v => updateData('phone', v)}
                    />
                    <Input
                        keyboardType="email-address"
                        placeholder="Email"
                        value={email}
                        setValue={v => updateData('email', v)}
                    />
                    <Button label={'Update'} onPress={update} />
                </View>
            </ScrollView>
        </BaseView>
    );
}
const styles = StyleSheet.create({
    body: {
        paddingTop: 50,
    },
});
