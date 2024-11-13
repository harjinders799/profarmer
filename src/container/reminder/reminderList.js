import React, { useCallback, useState, useEffect } from 'react';
import Text from '@components/text';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { strings } from '@translations/locale';
import { navigate } from '@navigation/ref';
import {
    currencyFormat,
    dateTimeFormat,
    dayCount,
    getTimeDetails,
} from '@utils/dateformat';
import { greenDark, navy, red } from '@utils/colors';
import { common } from '@utils/style';
import { useTheme } from '@react-navigation/native';
import Button from '@components/button';
import auth from '@react-native-firebase/auth';
import { getUserById } from '@network/auth-service';
import { ToastError } from '@utils/toast';
import { updateReminder } from '@network/reminder-service';
import notifee from '@notifee/react-native';

function ReminderList({ data }) {
    const { colors } = useTheme();

    const onCompletePress = async item => {
        try {
            await updateReminder({ id: item?.id, status: 'completed' });
            if (item?.local_notification_id)
                await notifee.cancelNotification(item?.local_notification_id);
        } catch (error) {
            ToastError(error?.message);
        }
    };

    // Optimized renderItem function using useCallback
    const renderItem = useCallback(
        ({ item }) => {
            const { remaining, passed } = getTimeDetails(
                Date.now(),
                item?.reminderDate,
            );
            return (
                <TouchableOpacity
                    style={[styles.list, { backgroundColor: colors.background }]}
                // onPress={() => navigate('LoanDetail', { item })}
                >
                    <View style={styles.row}>
                        <Text h4 style={{ maxWidth: '60%' }}>
                            {item?.title}
                        </Text>
                        <Text
                            h5
                            color={
                                item?.status == 'completed'
                                    ? colors.success
                                    : (remaining && remaining.includes('day')) || passed
                                        ? colors.error
                                        : colors.success
                            }>
                            {item?.status == 'completed'
                                ? strings[item?.status]
                                : remaining || passed}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text h5 style={{ maxWidth: '60%' }}>
                            {item?.description}
                        </Text>
                        <Button
                            small
                            label={strings.completed}
                            btnStyle={{
                                maxWidth: '40%',
                                marginVertical: 0,
                                height: 25,
                                backgroundColor: colors.success,
                                display: item.status != 'completed' ? 'flex' : 'none',
                            }}
                            onPress={() => onCompletePress(item)}
                        />
                    </View>
                </TouchableOpacity>
            );
        },
        [colors],
    );

    // Memoized key extractor
    const keyExtractor = useCallback(item => item?.id?.toString(), []);

    // Memoized ListEmptyComponent
    const ListEmptyComponent = useCallback(
        () => (
            <Text style={{ textAlign: 'center', paddingTop: 30 }}>
                {strings.no_data}
            </Text>
        ),
        [],
    );

    return (
        <FlatList
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 150 }}
            data={data}
            keyExtractor={keyExtractor}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        ...common.card,
        ...common.shadow,
        marginHorizontal: '5%',
        marginTop: '5%',
        width: '90%',
    },
    row: {
        ...common.row_btw,
        marginVertical: 5,
    },
    btn: {
        backgroundColor: navy,
        width: 'auto',
        maxWidth: '40%',
        height: 25,
        marginVertical: 0,
        borderRadius: 5,
    },
});

export default React.memo(ReminderList);
