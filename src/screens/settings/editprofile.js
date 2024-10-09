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
import {
    getUserByPhone,
    linkEmailWithPhone,
    UpdateUser,
} from '@network/auth-service';
import auth from '@react-native-firebase/auth';
import { strings } from '@translations/locale';
import Avatar from '@container/avatar';
import { checkUserLinkedData, handleImageSelection, isValidEmail, onChangeValue } from '@utils/helper';
import Icon from '@components/icon';
import Text from '@components/text';
import { common } from '@utils/style';
import { goBack } from '@navigation/ref';
import ImagePickerModal from '@components/imagePickerModal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const EditProfile = () => {
    const { user, getUser, reset } = useAuth();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: user?.name ?? '',
        phone: user?.phone ?? auth().currentUser?.phoneNumber ?? '',
        email: user?.email ?? auth().currentUser?.email,
        photoURL: user?.photoURL ?? auth().currentUser?.photoURL,
        password: '',
    });
    const [openModal, setOpenModal] = useState(false);

    const [alreadyUsedPhone, setAlreadyUsedPhone] = useState(false);
    const { isEmailLinked, isPhoneLinked, isEmailVerified, isPhoneVerified } =
        checkUserLinkedData(auth().currentUser);

    const updateUserData = async () => {
        try {
            setLoading(true);
            Keyboard.dismiss();

            if (!isPhoneLinked) {
                const res = await getUserByPhone(userData.phone);
                if (res?.id && res.id !== auth().currentUser?.uid) {
                    ToastError(strings.phoneInUse);
                    setUserData(prev => ({ ...prev, phone: '' }));
                    setAlreadyUsedPhone(true);
                    return false;
                }
            }

            await UpdateUser({
                ...userData,
                ...checkUserLinkedData(auth().currentUser),
            });
            ToastSuccess(strings.successfully_updated);
            getUser();

            setTimeout(goBack, 2000);
            return true;
        } catch (error) {
            ToastError(error?.message || strings.unknownError);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = useCallback(async () => {
        const { name, phone, email } = userData;

        if (!name) return ToastError(strings.fillName);
        if (!phone || phone.length < 10) return ToastError(strings.validPhone);
        if (!email || !isValidEmail(email)) return ToastError(strings.invalidEmail);

        try {
            if (!isEmailLinked) await linkEmailWithPhone(email, userData.password);
            await updateUserData();
        } catch (error) {
            ToastError(error?.message);
        }
    }, [userData]);

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


    const openCamera = () =>
        handleImageSelection(
            launchCamera,
            value => setUserData(prev => ({ ...prev, photoURL: value })),
            setOpenModal,
        );
    const openGallery = () =>
        handleImageSelection(
            launchImageLibrary,
            value => setUserData(prev => ({ ...prev, photoURL: value })),
            setOpenModal,
        );


    return (
        <BaseView space>
            <Loader visible={loading} />
            <Header
                back
                label={strings.profile}
                rightComponent={<Icon name="logout" size={25} onPress={onLogOut} />}
            />
            <ScrollView
                style={styles.scrollView}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    <Avatar imgEdit
                        img={userData?.photoURL} onEditImgTap={() => setOpenModal(true)} />
                    <Input
                        placeholder={strings.name}
                        value={userData.name}
                        setValue={value => setUserData(prev => ({ ...prev, name: value }))}
                    />
                    <Input
                        placeholder={strings.phone}
                        value={userData.phone.replace('+91', '')}
                        editable={alreadyUsedPhone ? true : !isPhoneVerified}
                        innerStyle={{
                            backgroundColor:
                                isPhoneVerified && !alreadyUsedPhone
                                    ? colors.disable
                                    : colors.background,
                        }}
                        maxLength={10}
                        keyboardType="phone-pad"
                        setValue={value => onChangeValue({ setData: setUserData, key: 'phone', value, isPhone: true })}
                        rightComponent={
                            <Icon
                                name={isPhoneVerified ? 'verified' : 'report'}
                                type="MaterialIcons"
                                color={isPhoneVerified ? colors.success : colors.error}
                                size={20}
                            />
                        }
                    />
                    {/* <Text
                        color={
                            isPhoneVerified || (isEmailLinked && isPhoneLinked)
                                ? colors.success
                                : colors.error
                        }
                        style={{ width: '100%', marginBottom: 5 }}>
                        {strings.phoneStatus.replace(
                            '{status}',
                            isPhoneVerified
                                ? strings.verified
                                : !isPhoneLinked
                                    ? strings.notLinked
                                    : isEmailLinked && isPhoneLinked
                                        ? strings.phoneLinkedWithEmail
                                        : strings.notVerified,
                        )}
                    </Text> */}
                    <View style={common.row_btw}>
                        <Input
                            placeholder={strings.email}
                            value={userData.email}
                            editable={!isEmailLinked}
                            innerStyle={{
                                backgroundColor: isEmailLinked
                                    ? colors.disable
                                    : colors.background,
                            }}
                            emailType
                            setValue={value => setUserData(prev => ({ ...prev, email: value }))}
                            rightComponent={
                                <Icon
                                    name={
                                        isEmailVerified
                                            ? 'verified'
                                            : isEmailLinked && isPhoneLinked
                                                ? 'link'
                                                : 'report'
                                    }
                                    type="MaterialIcons"
                                    color={
                                        isEmailVerified || (isEmailLinked && isPhoneLinked)
                                            ? colors.success
                                            : colors.error
                                    }
                                    size={20}
                                />
                            }
                        // style={{
                        //     maxWidth: isEmailVerified || !isEmailLinked ? '100%' : '83%',
                        // }}
                        />
                        {/* {(!isEmailVerified || isEmailLinked) && (
                            <Button
                                iconLeft={'check'}
                                btnStyle={{ width: '15%', marginVertical: 0 }}
                            />
                        )} */}
                    </View>
                    {/* <Text
                        color={
                            isEmailVerified || (isEmailLinked && isPhoneLinked)
                                ? colors.success
                                : colors.error
                        }
                        style={{ width: '100%', marginBottom: 5 }}>
                        {strings.emailStatus.replace(
                            '{status}',
                            isEmailVerified
                                ? strings.verified
                                : !isEmailLinked
                                    ? strings.notLinked
                                    : isEmailLinked && isPhoneLinked
                                        ? strings.emailLinkedWithPhone
                                        : strings.notVerified,
                        )}
                    </Text> */}
                    {!isEmailLinked && (
                        <Input
                            placeholder={strings.password}
                            value={userData.password}
                            setValue={password => setUserData(prev => ({ ...prev, password }))}
                        />
                    )}
                    <Button
                        label={!isEmailLinked ? strings.linkEmail : strings.update}
                        onPress={handleUpdate}
                    />
                </View>
            </ScrollView>
            <ImagePickerModal
                isVisible={openModal}
                onClose={() => setOpenModal(false)}
                onCameraPress={openCamera}
                onGalleryPress={openGallery}
            />
        </BaseView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
    },
    body: {
        alignItems: 'center',
    },
});

export default EditProfile;
