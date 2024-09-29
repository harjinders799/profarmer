import React, { useCallback, useState } from 'react';
import Text from '@components/text';
import { FlatList, StyleSheet, View } from 'react-native';
import { strings } from '@translations/locale';
import { dateFormat } from '@utils/dateformat';
import { navy } from '@utils/colors';
import { common } from '@utils/style';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { groupPickersByDate } from '@utils/helper';
import { pickersWeightListener } from '@network/picker-service';
import Button from '@components/button';
import { navigate } from '@navigation/ref';
import Animated, { LinearTransition } from 'react-native-reanimated';

function PickerDateWise({ pickers, groups }) {
    const { colors } = useTheme();
    const [pickersWeightData, setPickersWeightData] = useState([]);
    const fetchData = useCallback(() => {
        const unsubscribePickerWeight = pickersWeightListener(
            updatedDocuments => {
                setPickersWeightData(updatedDocuments);
                // setLoading(false);
            },
        );
        return () => {
            if (unsubscribePickerWeight) unsubscribePickerWeight();
        }; // Cleanup on unmount or dependency change
    }, [pickers]);

    useFocusEffect(fetchData);

    const data = groupPickersByDate(pickers, pickersWeightData);
    // Optimized renderItem function using useCallback
    const renderItem = useCallback(
        ({ item }) => {
            console.log(item);
            return (
                <View style={[styles.list, { backgroundColor: colors.background }]}>
                    <View style={styles.row}>
                        <Text h3 style={{ maxWidth: '60%' }}>
                            {dateFormat(item.date)}
                        </Text>
                        <Text h3>
                            {item?.total_weight}
                            <Text h6> Kg</Text>
                        </Text>
                    </View>
                    {item.pickers.map(picker => (
                        <View key={picker.name} style={styles.row}>
                            <Text>{picker?.name}</Text>
                            <Text>
                                {picker?.total_weight}
                                <Text h7> kg</Text>
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
            <Button
                label={'Add Weight Date Wise'}
                small
                btnStyle={{ width: '80%', alignSelf: 'center' }}
                onPress={() => navigate('AddPickerBulkWeight', { pickers })}
            />
            <FlatList
                style={{ width: '100%' }}
                contentContainerStyle={{ paddingBottom: 150 }}
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

export default React.memo(PickerDateWise);
