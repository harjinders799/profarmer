import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { strings } from '@translations/locale';
import { currencyFormat } from '@utils/dateformat';
import { useTheme } from '@react-navigation/native';
import Text from '@components/text';
import { common } from '@utils/style';
import { white } from '@utils/colors';
import { sumBy, debounce } from 'lodash';
import { updatePickersCalculation } from '@network/picker-service';
import auth from '@react-native-firebase/auth';

const Card = React.memo(({ title, subtitle, color, textColor }) => (
    <View style={[styles.card, { backgroundColor: color }]}>
        <Text h3 color={textColor}>
            {title}
        </Text>
        <Text color={textColor}>{subtitle}</Text>
    </View>
));

const PickerConclusion = ({ item, weights, expenses }) => {
    const { colors } = useTheme();
    const uid = auth()?.currentUser?.uid;

    // Memoize calculations to avoid unnecessary recalculations on re-renders
    const { totalWeight, totalEarning, totalGiven, finalAmount } = useMemo(() => {
        const totalWeight = sumBy(weights, w => parseFloat(w?.weight) || 0);
        const totalEarning = sumBy(
            weights,
            w => (parseFloat(w?.weight) || 0) * (parseFloat(w?.rate) || 0),
        );
        const totalGiven = sumBy(expenses, e => parseFloat(e?.amount) || 0);
        const finalAmount = totalEarning - totalGiven;

        return { totalWeight, totalEarning, totalGiven, finalAmount };
    }, [weights, expenses]); // Dependencies to recalculate only when these change

    // Debounced function to update Firestore
    const updateCalculation = useMemo(() => {
        return debounce(async () => {
            const { total_weight, total_earning, total_given } = item;

            if (
                (totalWeight !== total_weight ||
                    totalEarning !== total_earning ||
                    totalGiven !== total_given)
            ) {
                // Update Firestore with new totals
                await updatePickersCalculation({
                    totalWeight,
                    totalEarning,
                    totalGiven,
                    pid: item.id,
                });
            }
        }, 1500); // Adjust the delay time as needed
    }, [item, totalWeight, totalEarning, totalGiven]);

    // Call the debounced function
    useEffect(() => {
        if (item?.uid == uid) {
            updateCalculation(); // This will invoke the debounced function
            return () => {
                updateCalculation.cancel(); // Clean up on unmount or before the next call
            };
        }
    }, [updateCalculation]); // Run when updateCalculation changes

    return (
        <View style={styles.row}>
            <Card
                title={`${totalWeight.toFixed(2)} Kg`}
                subtitle={strings.total_weight}
                color={colors.secondaryCard}
            />
            <Card
                title={currencyFormat(totalEarning, 2)}
                subtitle={strings.total_amount}
                color={colors.secondaryCard}
                textColor={colors.success}
            />
            <Card
                title={`${currencyFormat(totalGiven, 2)}`}
                subtitle={item?.uid == uid ? strings.given_amount : strings.taken_amount}
                color={colors.secondaryCard}
                textColor={colors.error}
            />
            <Card
                title={currencyFormat(finalAmount, 2)}
                subtitle={strings.final}
                color={finalAmount > 0 ? colors.success : colors.error}
                textColor={white}
            />
        </View>
    );
};

export default PickerConclusion;

const styles = StyleSheet.create({
    row: {
        ...common.row_btw,
        flexWrap: 'wrap',
        paddingHorizontal: 20,
    },
    card: {
        ...common.shadow,
        ...common.card,
        padding: 10,
        marginTop: 10,
        width: '48%',
    },
});
