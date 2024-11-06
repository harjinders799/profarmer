import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import BaseView from '@container/base';
import Header from '@components/header';
import Text from '@components/text';
import { useRoute, useTheme } from '@react-navigation/native';
import _ from 'lodash';
import { currencyFormat } from '@utils/dateformat';
import { common } from '@utils/style';
import { strings } from '@translations/locale';
import { white } from '@utils/colors';

const CropAnalysis = () => {
    const { colors } = useTheme();
    const {
        params: { data, events },
    } = useRoute();
    // console.log(JSON.stringify(events))

    // Flatten categories and group data by category
    const flattenedData = _.flatMap(events, entry =>
        _.map(entry.categories, category => ({
            type: entry.type,
            category: category.category,
            amount: parseFloat(category.amount),
            title: entry.title,
            description: entry.description,
            totalAmount: entry.totalAmount,
            total_earning: entry.total_earning,
            total_expense: entry.total_expense,
            date: entry.date,
            id: entry.id,
        })),
    );

    // Filter out empty categories and group by category
    const groupedData = _.chain(flattenedData)
        .filter(item => item.category) // Filter out empty categories
        .groupBy('category') // Group by category
        .map((items, category) => ({
            category,
            expenseAmount: _.sumBy(
                items.filter(i => i.type === 'expense'),
                'amount',
            ), // Sum expense amounts
            earningAmount: 0, // Set earningAmount to 0, assuming no earnings in the provided data
            expenseData: items.filter(i => i.type === 'expense'), // Filter expense items
            earningData: [], // No earning data in the provided input
        }))
        .value();

    console.log(groupedData);

    return (
        <BaseView>
            <Header back label={'Crop Analysis'} />
            {/* <Text>यहाँ पर आप केटेगरी के हिसाब से खर्चे और कमाई देख सको गे।</Text> */}
            <View style={common.row_btw}>
                <View style={[styles.box, { backgroundColor: colors.success }]}>
                    <Text h4 color={white}>
                        {currencyFormat(data?.total_earning)}
                    </Text>
                    <Text color={white}>{strings.earning}</Text>
                </View>
                <View style={[styles.box, { backgroundColor: colors.error }]}>
                    <Text h4 color={white}>
                        {currencyFormat(data?.total_expense)}
                    </Text>
                    <Text color={white}>{strings.expense}</Text>
                </View>
            </View>
            <FlatList
                contentContainerStyle={styles.body}
                data={groupedData}
                style={{ width: '100%' }}
                keyExtractor={item => item?.category}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.card,
                            common.row_btw,
                            { backgroundColor: colors.background, width: 'auto' },
                        ]}>
                        <Text bold h4>
                            {strings[item?.category]}
                        </Text>
                        <View>
                            {item?.expenseAmount ? (
                                <View style={[styles.expense, { backgroundColor: colors.error }]}>
                                    <Text h4 color={white}>
                                        {currencyFormat(item?.expenseAmount)}
                                    </Text>
                                    <Text color={white}>{strings.expense}</Text>
                                </View>
                            ) : null}
                            {item?.earningAmount ? (
                                <View
                                    style={[styles.earning, { backgroundColor: colors.success }]}>
                                    <Text h4 color={white}>
                                        {currencyFormat(item?.earningAmount)}
                                    </Text>
                                    <Text color={white}>{strings.earning}</Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                )}
            />
        </BaseView>
    );
};

export default CropAnalysis;

const styles = StyleSheet.create({
    body: {
        width: '100%',
        paddingBottom: 100,
    },
    card: {
        ...common.card,
        ...common.shadow,
        margin: 10,
    },
    box: {
        margin: 10,
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        minWidth: '30%',
        maxWidth: '48%',
    },
    expense: {
        padding: 10,
        paddingHorizontal: 20,
        marginTop: -10,
        marginRight: -10,
        marginBottom: 5,
        alignItems: 'center',
        borderBottomLeftRadius: 10,
    },
    earning: {
        padding: 10,
        marginTop: 5,
        paddingHorizontal: 20,
        marginRight: -10,
        marginBottom: -10,
        alignItems: 'center',
        borderTopLeftRadius: 10,
    },
});
