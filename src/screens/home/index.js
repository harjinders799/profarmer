import { ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import BaseView from '@container/base';
import Header from '@components/header';
import { storage, tabsData } from '@utils/helper';
import Icon from '@components/icon';
import { strings } from '@translations/locale';
import { common } from '@utils/style';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import Text from '@components/text';
import { navigate, replace } from '@navigation/ref';
import { useAuth } from '@context/authContext';
import { ToastError, ToastProgress } from '@utils/toast';
import { red } from '@utils/colors';
import { useLang } from '@context/langContext';
import { getAccessToken, updateReadAccessToUID } from '@network/auth-service';
import Loader from '@components/loader';
import { backupData, backupUserData, notificationCountListener, uploadFromJsonFile, uploadToFirestore } from '@network/common-service';
import Button from '@components/button';
import moment from 'moment';
import Contributors from '@container/home/contributors';
import Avatar from '@container/avatar';
import analytics from '@react-native-firebase/analytics';
import app from '@react-native-firebase/app';

export default function Home() {
    const { colors } = useTheme();
    const { user } = useAuth();
    const { lang } = useLang();
    const [loading, setLoading] = useState(false);
    const [backupCreating, setBackupCreating] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [lastBackupTime, setLastBackupTime] = useState();
    const tabs = [...tabsData];
    tabs.shift();

    useFocusEffect(
        useCallback(() => {
            let res = storage.getNumber('last_backup');
            if (!res || !lastBackupTime) setLastBackupTime(res);
            if (
                user?.id &&
                (!user?.phone ||
                    !user?.name ||
                    (user?.phone && user.phone.length == 10))
            ) {
                navigate('EditProfile');
                return ToastError(strings.complete_profile);
            }
            if (user?.id && user?.phone) {
                (async () => {
                    try {
                        setLoading(true);
                        await analytics().logEvent('user', {
                            id: user?.id,
                            data: user,
                        });
                        let res = storage.getBoolean('replace_phone_with_id');
                        if (!res) await updateReadAccessToUID(user?.phone);
                        storage.set('replace_phone_with_id', true);
                    } catch (error) {
                        console.log({ error }, 'home');
                    } finally {
                        setLoading(false);
                    }
                })();
            }
            const unsubscribeNotificationCount = notificationCountListener(
                updatedDocuments => {
                    setNotificationCount(updatedDocuments);
                },
            );

            return () => {
                unsubscribeNotificationCount && unsubscribeNotificationCount();
            }; // Cleanup on unmount or dependency change
        }, [user, lang]),
    );

    const onBackupPress = async () => {
        try {
            setBackupCreating(true);
            if (app.app()?.options?.projectId == 'profarmer-6180a')
                await uploadToFirestore()
            else await backupUserData();
            // await backupData()
            storage.set('last_backup', Date.now());
            setLastBackupTime(Date.now());
        } catch (error) {
            console.log({ error })
            ToastError(error?.message);
        } finally {
            setBackupCreating(false);
        }
    };

    return (
        <BaseView>
            <Header
                label={`Hey ${user?.name ?? user?.phone ?? user?.email ?? '...'} !!`}
                notification
                notificationCount={notificationCount}
                leftComponent={
                    <Avatar small onEditImgTap={() => navigate('EditProfile')} />
                }
            />
            <Loader visible={loading} />
            <View
                style={[
                    { width: '95%', backgroundColor: colors.background, marginBottom: 15 },
                    common.shadow,
                    common.card,
                ]}>
                <Text justify color={colors.warning} style={{ width: '100%' }}>
                    <Text bold color={colors.warning}>
                        {strings.important_note}
                    </Text>
                    {strings.backup_data_warning}
                </Text>
                <View style={common.row_btw}>
                    <Button
                        small
                        label={'Backup Now'}
                        loading={backupCreating}
                        onPress={onBackupPress}
                        btnStyle={{ width: 'auto', maxWidth: '40%' }}
                    />
                    <Text>
                        {`${lastBackupTime ? moment(lastBackupTime).format('lll') : 'NEVER'
                            } `}
                        <Text h7>Last Backup</Text>
                    </Text>
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    common.row_btw,
                    { flexWrap: 'wrap', paddingHorizontal: 10, paddingBottom: 50 },
                ]}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        onPress={() => navigate(tab.name)}
                        key={tab.id}
                        style={[
                            common.card,
                            common.shadow,
                            {
                                backgroundColor: colors.secondaryCard,
                                marginTop: '5%',
                                // paddingVertical: 20,
                                width: '47%',
                            },
                        ]}>
                        <Icon name={tab.icon} type={tab.iconType} size={25} />
                        <Text h4 semi style={{ marginTop: 5 }}>
                            {strings[tab.title]}
                        </Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    onPress={() => ToastProgress(strings.in_progress)}
                    style={[
                        common.card,
                        // common.shadow,
                        {
                            backgroundColor: colors.secondaryCard,
                            marginVertical: '3%',
                            // paddingVertical: 20,
                            width: '47%',
                        },
                    ]}>
                    <Icon name={'tractor'} type={'FontAwesome5'} size={25} />
                    <Text h4 semi style={{ marginTop: 5 }}>
                        {'Harvest'}
                    </Text>
                    <Text h7 semi color={red}>
                        {'Coming soon'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => ToastProgress(strings.in_progress)}
                    style={[
                        common.card,
                        // common.shadow,
                        {
                            backgroundColor: colors.secondaryCard,
                            marginVertical: '3%',
                            // paddingVertical: 20,
                            width: '47%',
                        },
                    ]}>
                    <Icon
                        name={'file-document-multiple-outline'}
                        type={'MaterialCommunityIcons'}
                        size={25}
                    />
                    <Text h4 semi style={{ marginTop: 5 }}>
                        {'Doc Reminder'}
                    </Text>
                    <Text h7 semi color={red}>
                        {'Coming soon'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => ToastProgress(strings.in_progress)}
                    style={[
                        common.card,
                        // common.shadow,
                        {
                            backgroundColor: colors.secondaryCard,
                            marginVertical: '3%',
                            // paddingVertical: 20,
                            width: '47%',
                        },
                    ]}>
                    <Icon name={'local-grocery-store'} type={'MaterialIcons'} size={25} />
                    <Text h4 semi style={{ marginTop: 5 }}>
                        {'Home Expense'}
                    </Text>
                    <Text h7 semi color={red}>
                        {'Coming soon'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={getAccessToken}
                    // onPress={() => ToastProgress(strings.in_progress)}
                    style={[
                        common.card,
                        // common.shadow,
                        {
                            backgroundColor: colors.secondaryCard,
                            marginVertical: '3%',
                            // paddingVertical: 20,
                            width: '47%',
                        },
                    ]}>
                    <Icon name={'cow'} type={'FontAwesome6'} size={25} />
                    <Text h4 semi style={{ marginTop: 5 }}>
                        {'Milk'}
                    </Text>
                    <Text h7 semi color={red}>
                        {'Coming soon'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <Contributors />
        </BaseView>
    );
}
