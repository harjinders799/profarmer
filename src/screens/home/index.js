import { ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import BaseView from '@container/base';
import Header from '@components/header';
import { tabsData } from '@utils/helper';
import Icon from '@components/icon';
import { strings } from '@translations/locale';
import { common } from '@utils/style';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import Text from '@components/text';
import { navigate, replace } from '@navigation/ref';
import { useAuth } from '@context/authContext';
import { ToastError, ToastProgress } from '@utils/toast';
import { red } from '@utils/colors';

export default function Home() {
    const { colors } = useTheme();
    const { user } = useAuth();

    const tabs = [...tabsData];
    tabs.shift();
    useFocusEffect(useCallback(() => {

        if (user?.id && !user?.phone) {
            navigate('EditProfile')
            return ToastError('Please Complete your profile!!')
        }
    }, [user]))

    return (
        <BaseView>
            <Header
                label={`Welcome ${user?.name ?? user?.phone ?? user?.email ?? '...'
                    } !!`}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    common.row_btw,
                    { flexWrap: 'wrap', padding: 20, paddingBottom: 150 },
                ]}>
                <Text justify color={colors.warning} style={{ width: '100%' }}>
                    <Text bold color={colors.warning}>
                        {'Important Note: '}
                    </Text>
                    We are currently working on enhancing the app. During this development
                    phase, we recommend that you keep your data backed up in the previous
                    method to ensure its safety. Thank you for your understanding!
                </Text>
                {tabs.map(tab => (
                    <TouchableOpacity
                        onPress={() => navigate(tab.name)}
                        key={tab.id}
                        style={[
                            common.card,
                            common.shadow,
                            {
                                backgroundColor: colors.secondaryCard,
                                marginVertical: '3%',
                                paddingVertical: 20,
                                width: '47%',
                            },
                        ]}>
                        <Icon name={tab.icon} type={tab.iconType} size={25} />
                        <Text h3 semi style={{ marginTop: 5 }}>
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
                            paddingVertical: 20,
                            width: '47%',
                        },
                    ]}>
                    <Icon name={'tractor'} type={'FontAwesome5'} size={25} />
                    <Text h3 semi style={{ marginTop: 5 }}>
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
                            paddingVertical: 20,
                            width: '47%',
                        },
                    ]}>
                    <Icon
                        name={'file-document-multiple-outline'}
                        type={'MaterialCommunityIcons'}
                        size={25}
                    />
                    <Text h3 semi style={{ marginTop: 5 }}>
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
                            paddingVertical: 20,
                            width: '47%',
                        },
                    ]}>
                    <Icon name={'local-grocery-store'} type={'MaterialIcons'} size={25} />
                    <Text h3 semi style={{ marginTop: 5 }}>
                        {'Home Expense'}
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
                            paddingVertical: 20,
                            width: '47%',
                        },
                    ]}>
                    <Icon name={'cow'} type={'FontAwesome6'} size={25} />
                    <Text h3 semi style={{ marginTop: 5 }}>
                        {'Milk'}
                    </Text>
                    <Text h7 semi color={red}>
                        {'Coming soon'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </BaseView>
    );
}
