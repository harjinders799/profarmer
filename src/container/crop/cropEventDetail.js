import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import Text from '@components/text';
import { currencyFormat, dateFormat, dayCount } from '@utils/dateformat';
import Animated, {
    BounceIn,
    BounceInLeft,
    BounceInRight,
} from 'react-native-reanimated';
import { common } from '@utils/style';
import { strings } from '@translations/locale';
import { navigate, replace } from '@navigation/ref';
import { sumBy } from 'lodash';

const CropEventDetail = ({ data, events }) => {
    const { colors } = useTheme();

    return (
        <View>
            {events.map((item, index) => {
                const isExpense = item?.type
                    ? item?.type == 'expense'
                    : !!item?.expense_amount;
                const isEarning = item?.type
                    ? item?.type == 'earning'
                    : !!item?.earning_amount;

                return (
                    <Animated.View
                        key={index}
                        entering={
                            isExpense
                                ? BounceInLeft.delay(index * 150)
                                : isEarning
                                    ? BounceInRight.delay(index * 50)
                                    : BounceIn.delay(index * 50)
                        }
                        style={styles.eventContainer}>
                        <TouchableOpacity
                            style={[
                                common.row_btw,
                                styles.touchableContainer(isExpense, isEarning),
                            ]}
                            onPress={() => replace('AddEvent', { item, data })}>
                            <View style={styles.dateContainer(isExpense, isEarning)}>
                                {item?.type ? <Text center bold>
                                    {currencyFormat(
                                        item?.expense_amount ||
                                        item?.earning_amount ||
                                        sumBy(item?.categories, o =>
                                            parseFloat(o?.amount || '0'),
                                        ),
                                    )}
                                </Text> : null}
                                <Text center style={{ marginVertical: item?.type ? 10 : 0 }}>
                                    {dayCount(item?.date)} {strings.day} {strings.ago}
                                </Text>
                                <Text center>{dateFormat(item?.date)}</Text>
                            </View>
                            <Animated.View
                                entering={BounceIn}
                                style={styles.divider(isExpense, isEarning, colors)}
                            />
                            <View style={styles.cardContainer(isExpense, isEarning, colors)}>
                                <View
                                    style={[
                                        common.card,
                                        styles.backgroundOverlay(isExpense, isEarning, colors),
                                    ]}
                                />
                                <Text bold h4>
                                    {item?.title}
                                </Text>
                                {item?.description ? <Text h5 style={styles.description}>
                                    {item?.description}
                                </Text> : null}
                                {(isExpense && item?.expense_amount) ||
                                    (isEarning && item?.earning_amount) ? (
                                    <Text bold style={styles.amount}>
                                        {currencyFormat(
                                            item?.expense_amount ?? item?.earning_amount,
                                        )}
                                    </Text>
                                ) : null}
                                {item?.categories && Array.isArray(item?.categories)
                                    ? item.categories.map((cat, index) => (
                                        cat?.category ? <Text key={index} bold style={styles.amount}>
                                            {strings[cat?.category]} = {currencyFormat(cat?.amount)}
                                        </Text> : null
                                    ))
                                    : null}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    eventContainer: {
        margin: 10,
        marginVertical: 20,
    },
    touchableContainer: (isExpense, isEarning) => ({
        flexDirection: isExpense
            ? 'row-reverse'
            : isEarning
                ? 'row'
                : 'column-reverse',
        alignItems: isExpense || isEarning ? 'stretch' : 'center',
    }),
    dateContainer: (isExpense, isEarning) => ({
        justifyContent: isExpense || isEarning ? 'center' : 'space-around',
        flexDirection: isExpense || isEarning ? 'column' : 'row',
        width: isExpense || isEarning ? 'auto' : '50%',
    }),
    divider: (isExpense, isEarning, colors) => ({
        height: isExpense || isEarning ? 'auto' : 0,
        width: 1,
        opacity: 0.3,
        margin: isExpense || isEarning ? 0 : '1%',
        backgroundColor: isExpense
            ? colors.error
            : isEarning
                ? colors.success
                : colors.secondaryBackground,
    }),
    cardContainer: (isExpense, isEarning, colors) => ({
        ...common.shadow,
        ...common.card,
        backgroundColor: colors.background,
        width: isExpense || isEarning ? '70%' : '90%',
        marginHorizontal: isExpense || isEarning ? '0%' : '5%',
    }),
    backgroundOverlay: (isExpense, isEarning, colors) => ({
        backgroundColor: isExpense
            ? colors.error
            : isEarning
                ? colors.success
                : colors.secondaryCard,
        opacity: 0.2,
        ...StyleSheet.absoluteFillObject,
    }),
    description: {
        marginTop: 5,
    },
    amount: {
        marginTop: 15,
        width: '100%',
    },
});

export default CropEventDetail;
