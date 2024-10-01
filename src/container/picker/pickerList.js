import React, { useCallback, useState, useEffect } from 'react';
import Text from '@components/text';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { strings } from '@translations/locale';
import { navigate } from '@navigation/ref';
import { currencyFormat } from '@utils/dateformat';
import { navy } from '@utils/colors';
import { common } from '@utils/style';
import { useTheme } from '@react-navigation/native';
import Button from '@components/button';
import auth from '@react-native-firebase/auth';
import { getUserById } from '@network/auth-service';
import { findPickerGroupNames } from '@utils/helper';
import Animated, { LinearTransition } from 'react-native-reanimated';

function PickerList({ data, groups, refreshing, onRefresh }) {
    const { colors } = useTheme();
    const uid = auth()?.currentUser?.uid;
    const [owners, setOwners] = useState({});

    // Fetch owner data for each unique user ID
    useEffect(() => {
        const fetchOwners = async () => {
            const uniqueUserIds = [...new Set(data.map(item => item.uid))];
            const fetchedOwners = {};

            for (const uid of uniqueUserIds) {
                try {
                    if (uid != auth()?.currentUser?.uid) {
                        const user = await getUserById(uid);
                        fetchedOwners[uid] = user;
                    }
                } catch (error) {
                    console.error('Error fetching user by ID:', error);
                }
            }

            setOwners(fetchedOwners);
        };

        fetchOwners();
    }, [data]);

    // Optimized renderItem function using useCallback
    const renderItem = useCallback(
        ({ item }) => {
            const owner = owners[item.uid] || {}; // Use fetched owner data or empty object if not available
            const finalAmount = item?.total_earning - item?.total_given;
            const pickerGroupName = findPickerGroupNames(item, groups);
            return (
                <TouchableOpacity
                    style={[styles.list, { backgroundColor: colors.background }]}
                    onPress={() =>
                        navigate('PickerDetail', { item, pickers: data, groups })
                    }>
                    <View style={styles.row}>
                        <Text h3 style={{ maxWidth: '60%' }}>
                            {item?.uid === uid ? item?.name : owner?.name || '--'}
                        </Text>
                        <Text
                            h3
                            style={{
                                color: finalAmount < 0 ? colors.error : colors.success,
                                maxWidth: '40%',
                            }}>
                            {currencyFormat(finalAmount > 0 ? finalAmount : -finalAmount)}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text h6 color={item?.uid === uid ? colors.warning : colors.border}>
                            {item?.uid === uid ? pickerGroupName : 'Read Only'}
                        </Text>
                        <Text h6 color={finalAmount < 0 ? colors.error : colors.success}>
                            {finalAmount === 0
                                ? '____'
                                : finalAmount > 0 && item?.uid == uid
                                    ? strings.give
                                    : strings.receive}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.row,
                            { display: item?.uid === uid ? 'flex' : 'none' },
                        ]}>
                        <Button
                            small
                            iconLeft={item?.uid === uid ? 'plus' : null}
                            label={strings.amount}
                            btnStyle={[
                                styles.btn,
                                {
                                    backgroundColor: item?.uid === uid ? navy : colors.border,
                                },
                            ]}
                            disabled={item?.uid !== uid}
                            onPress={() =>
                                navigate('AddPickerExpense', {
                                    data: item,
                                })
                            }
                        />
                        <Button
                            small
                            iconLeft={item?.uid === uid ? 'plus' : null}
                            label={strings.weight}
                            btnStyle={[
                                styles.btn,
                                {
                                    backgroundColor:
                                        item?.uid === uid ? colors.warning : colors.border,
                                },
                            ]}
                            disabled={item?.uid !== uid}
                            onPress={() =>
                                navigate('AddPickerWeight', {
                                    data: item,
                                })
                            }
                        />
                    </View>
                </TouchableOpacity>
            );
        },
        [colors, owners],
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
        <Animated.FlatList
            layout={LinearTransition}
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 150 }}
            data={data}
            refreshing={refreshing}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
        padding: 10,
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

export default React.memo(PickerList);
