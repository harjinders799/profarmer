import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { strings } from '@translations/locale';
import { currencyFormat } from '@utils/dateformat';
import { useTheme } from '@react-navigation/native';
import Text from '@components/text';
import { common } from '@utils/style';
import { white } from '@utils/colors';
import { sumBy } from 'lodash';
import Animated, {
    LinearTransition,
    SlideInUp,
    SlideOutUp,
} from 'react-native-reanimated';

const Card = React.memo(({ title, subtitle, color, textColor }) => (
    <View style={[styles.card, { backgroundColor: color }]}>
        <Text h3 color={textColor}>
            {title}
        </Text>
        <Text color={textColor}>{subtitle}</Text>
    </View>
));

const PickersConclusion = ({ pickers }) => {
    const { colors } = useTheme();

    // Memoize calculations to avoid unnecessary recalculations on re-renders
    const { totalWeight, totalEarning, totalGiven, finalAmount } = useMemo(() => {
        const totalWeight = sumBy(pickers, p => parseFloat(p?.total_weight) || 0);
        const totalEarning = sumBy(
            pickers,
            p => (parseFloat(p?.total_weight) || 0) * (parseFloat(p?.rate) || 0),
        );
        const totalGiven = sumBy(pickers, p => parseFloat(p?.total_given) || 0);
        const finalAmount = totalEarning - totalGiven;

        return { totalWeight, totalEarning, totalGiven, finalAmount };
    }, [pickers]); // Dependencies to recalculate only when these change

    return (
        <Animated.View
            layout={LinearTransition}
            entering={SlideInUp}
            exiting={SlideOutUp}
            style={styles.row}>
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
                subtitle={strings.given_amount}
                color={colors.secondaryCard}
                textColor={colors.error}
            />
            <Card
                title={currencyFormat(finalAmount, 2)}
                subtitle={strings.final}
                color={finalAmount > 0 ? colors.success : colors.error}
                textColor={white}
            />
        </Animated.View>
    );
};

export default PickersConclusion;

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
