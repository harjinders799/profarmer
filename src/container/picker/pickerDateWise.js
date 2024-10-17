import React, { useCallback, useState } from 'react';
import Text from '@components/text';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { strings } from '@translations/locale';
import { currencyFormat, dateFormat } from '@utils/dateformat';
import { navy } from '@utils/colors';
import { common } from '@utils/style';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { groupPickersByDate } from '@utils/helper';
import {
    pickersExpenseListener,
    pickersWeightListener,
} from '@network/picker-service';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { hp } from '@utils/fonts';

function PickerDateWise({ pickers, groups, refreshing, onRefresh }) {
    const { colors } = useTheme();
    const [pickersWeightData, setPickersWeightData] = useState([]);
    const [pickersExpenseData, setPickersExpenseData] = useState([]);
    const fetchData = useCallback(() => {
        const unsubscribePickerWeight = pickersWeightListener(updatedDocuments => {
            setPickersWeightData(updatedDocuments);
            // setLoading(false);
        });
        const unsubscribePickerExpense = pickersExpenseListener(
            updatedDocuments => {
                setPickersExpenseData(updatedDocuments);
                // setLoading(false);
            },
        );
        return () => {
            if (unsubscribePickerWeight) unsubscribePickerWeight();
            if (unsubscribePickerExpense) unsubscribePickerExpense();
        }; // Cleanup on unmount or dependency change
    }, [pickers, refreshing]);

    useFocusEffect(fetchData);

    const data = groupPickersByDate(
        pickers,
        pickersWeightData,
        pickersExpenseData,
    );

    // Optimized renderItem function using useCallback
    const renderItem = useCallback(
        ({ item }) => {
            return (
                <View style={[styles.list, { backgroundColor: colors.background }]}>
                    <View style={styles.row}>
                        <Text h5 style={{ width: '30%' }}>
                            {dateFormat(item.date)}
                        </Text>
                        <Text h4 center color={colors.error} style={{ width: '30%' }}>
                            {currencyFormat(item?.total_expense)}
                        </Text>
                        <Text h4 right color={colors.success} style={{ width: '30%' }}>
                            {item?.total_weight}
                            <Text h6 color={colors.success}>
                                {' '}
                                Kg
                            </Text>
                        </Text>
                    </View>
                    {item.pickers.map(picker => (
                        <View key={picker.name} style={styles.row}>
                            <Text style={{ width: '30%' }}>{picker?.name}</Text>
                            <Text center color={colors.error} style={{ width: '30%' }}>
                                {currencyFormat(picker?.total_expense)}
                            </Text>
                            <Text right color={colors.success} style={{ width: '30%' }}>
                                {picker?.total_weight}
                                <Text h7 color={colors.success}>
                                    {' '}
                                    kg
                                </Text>
                            </Text>
                        </View>
                    ))}
                </View>
            );
        },
        [pickersWeightData],
    );

    // Memoized key extractor
    const keyExtractor = useCallback(item => item?.date?.toString(), []);

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
        <Animated.View layout={LinearTransition} style={{ width: '100%' }}>
            <View
                style={[common.row_btw, { paddingHorizontal: 25 }]}>
                <Text bold style={{ width: '30%' }}>
                    {strings.date}
                </Text>
                <Text bold center color={colors.error} style={{ width: '30%' }}>
                    {strings.given_amount}
                </Text>
                <Text bold right color={colors.success} style={{ width: '30%' }}>
                    {strings.weight}
                </Text>
            </View>
            <FlatList
                style={{ width: '100%' }}
                // refreshing={refreshing}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            fetchData();
                            onRefresh();
                        }}
                    />
                }
                contentContainerStyle={{ paddingBottom: hp(30) }}
                data={data}
                keyExtractor={keyExtractor}
                ListEmptyComponent={ListEmptyComponent}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    list: {
        ...common.card,
        ...common.shadow,
        padding: 10,
        marginHorizontal: '5%',
        marginTop: '3%',
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

export default React.memo(PickerDateWise);
