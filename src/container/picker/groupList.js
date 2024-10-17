import React, { useCallback } from 'react';
import Text from '@components/text';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { strings } from '@translations/locale';
import { navigate } from '@navigation/ref';
import { currencyFormat } from '@utils/dateformat';
import { common } from '@utils/style';
import { useTheme } from '@react-navigation/native';
import Button from '@components/button';
import { calculateGroupFinalAmount } from '@utils/helper';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { navy } from '@utils/colors';
import { RefreshControl } from 'react-native-gesture-handler';

function GroupList({ data, pickers, refreshing, onRefresh }) {
    const { colors } = useTheme();

    const renderItem = useCallback(
        ({ item }) => {
            const finalAmount = calculateGroupFinalAmount(item, pickers);
            return (
                <TouchableOpacity
                    style={[styles.list, { backgroundColor: colors.background }]}
                    onPress={() => navigate('PickerGroupDetail', { item, pickers })}>
                    <Text h7 style={styles.count}>
                        {item?.members.length} {strings.pickers}
                    </Text>

                    <View style={styles.row}>
                        <Text h3 style={{ maxWidth: '60%' }}>
                            {item?.name}
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
                        <Button
                            iconLeft={'edit'}
                            small
                            btnStyle={[styles.btn, { backgroundColor: colors.warning }]}
                            onPress={() =>
                                navigate('CreatePickerGroup', { pickers, groups: data, item })
                            }
                        />
                        <Text h6 color={finalAmount < 0 ? colors.error : colors.success}>
                            {finalAmount === 0
                                ? '____'
                                : finalAmount > 0
                                    ? strings.give
                                    : strings.receive}
                        </Text>
                    </View>
                    <View style={[styles.row]}>
                        <Button
                            small
                            iconLeft={'plus'}
                            label={strings.amount}
                            btnStyle={[
                                styles.btn,
                                {
                                    backgroundColor: navy,
                                },
                            ]}
                            onPress={() => navigate('AddPickerBulkExpense', { item, groups: data, pickers })}
                        />
                        <Button
                            small
                            iconLeft={'plus'}
                            label={strings.weight}
                            btnStyle={[
                                styles.btn,
                                {
                                    backgroundColor: colors.warning,
                                },
                            ]}
                            onPress={() => navigate('AddPickerBulkWeight', { item, groups: data, pickers })}
                        />
                    </View>
                </TouchableOpacity>
            );
        },
        [data, pickers],
    );

    // Memoized key extractor
    const keyExtractor = useCallback(
        item => item?.id?.toString(),
        [pickers, data],
    );

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
        marginHorizontal: '2.5%',
        marginTop: '5%',
        width: '95%',
    },
    row: {
        ...common.row_btw,
        marginVertical: 5,
    },
    count: {
        position: 'absolute',
        top: 5,
    },
    btn: {
        width: 'auto',
        maxWidth: '40%',
        height: 25,
        marginVertical: 0,
    },
});

export default React.memo(GroupList);
