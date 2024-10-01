import React, { useMemo, useState } from 'react';
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
import Tabs from '@components/tabs';
import auth from '@react-native-firebase/auth';

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
    const [activeTab, setActiveTab] = useState('My Pickers');
    const uid = auth()?.currentUser?.uid;

    const pickerData =
        activeTab == 'Me'
            ? pickers.filter(o => o?.uid !== uid)
            : pickers.filter(o => o?.uid == uid);
    // Memoize calculations to avoid unnecessary recalculations on re-renders
    const { totalWeight, totalEarning, totalGiven, finalAmount } = useMemo(() => {
        const totalWeight = sumBy(
            pickerData,
            p => parseFloat(p?.total_weight) || 0,
        );
        const totalEarning = sumBy(
            pickerData,
            p => (parseFloat(p?.total_weight) || 0) * (parseFloat(p?.rate) || 0),
        );
        const totalGiven = sumBy(pickerData, p => parseFloat(p?.total_given) || 0);
        const finalAmount = totalEarning - totalGiven;

        return { totalWeight, totalEarning, totalGiven, finalAmount };
    }, [pickerData]); // Dependencies to recalculate only when these change

    return (
        <Animated.View
            layout={LinearTransition}
            entering={SlideInUp}
            exiting={SlideOutUp}
            style={styles.row}>
            <Tabs
                // style={{ width: '90%' }}
                tabs={['My Pickers', 'Me']}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
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
                subtitle={
                    activeTab == 'Me' ? strings.taken_amount : strings.given_amount
                }
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
        ...common.row_center,
        flexWrap: 'wrap',
        marginBottom: 40
        // paddingHorizontal: 20,
    },
    card: {
        ...common.shadow,
        ...common.card,
        padding: 10,
        marginTop: 10,
        minWidth: '44%',
        maxWidth: '48%',
        marginHorizontal: '1%',
    },
});
