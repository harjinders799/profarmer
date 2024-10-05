import React, { useState, useCallback } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { useAuth } from '@context/authContext';
import BaseView from '@container/base';
import Header from '@components/header';
import Input from '@components/input';
import Button from '@components/button';
import Loader from '@components/loader';
import { ToastError, ToastSuccess } from '@utils/toast';
import { useTheme } from '@react-navigation/native';
import { getUserByPhone, UpdateUser } from '@network/auth-service';
import auth from '@react-native-firebase/auth';
import { strings } from '@translations/locale';
import Profile from '@container/profile';

const EditProfile = () => {
    const { user, getUser } = useAuth();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: user?.name ?? '',
        phone: user?.phone ?? auth().currentUser?.phoneNumber ?? '',
        email: user?.email ?? auth().currentUser?.email,
    });
    const [alreadyUsedPhone, setAlreadyUsedPhone] = useState(false)

    const updateUserData = async () => {
        const { name, phone } = userData;

        if (!name) {
            ToastError(strings.fillName);
            return false;
        }
        if (!phone || phone.length < 10) {
            ToastError(strings.validPhone);
            return false;
        }

        try {
            setLoading(true);
            Keyboard.dismiss()
            const res = await getUserByPhone(phone);
            if (res?.id && res.id !== auth().currentUser?.uid) {
                ToastError(strings.phoneInUse);
                setUserData((prev) => ({ ...prev, phone: '' }))
                setAlreadyUsedPhone(true)
                return false;
            }
            await UpdateUser(userData);
            ToastSuccess(strings.successfully_updated);
            getUser();
            return true;
        } catch (error) {
            ToastError(error?.message || strings.unknownError);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = useCallback(async () => {
        await updateUserData();
    }, [userData]);

    return (
        <BaseView space>
            <Loader visible={loading} />
            <Header back label={strings.profile} />
            <ScrollView
                style={styles.scrollView}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.body}>
                    <Profile imgEdit />
                    <Input
                        placeholder={strings.name}
                        value={userData.name}
                        setValue={(value) => setUserData((prev) => ({ ...prev, name: value }))}
                    />
                    <Input
                        placeholder={strings.phone}
                        value={userData.phone.replace('+91', '')}
                        editable={alreadyUsedPhone ? true : !user?.phone}
                        innerStyle={{
                            backgroundColor: user.phone && !alreadyUsedPhone ? colors.disable : colors.background,
                        }}
                        maxLength={10}
                        keyboardType="phone-pad"
                        setValue={(value) => setUserData((prev) => ({ ...prev, phone: value }))}
                    />
                    <Input
                        placeholder={strings.email}
                        value={userData.email}
                        editable={false}
                        innerStyle={{ backgroundColor: colors.disable }}
                    />
                    <Button label={strings.update} onPress={handleUpdate} />
                </View>
            </ScrollView>
        </BaseView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
    },
    body: {
        alignItems: 'center'
    },
});

export default EditProfile;
