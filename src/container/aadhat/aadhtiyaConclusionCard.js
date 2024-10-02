import React, { Fragment, memo } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import Text from '@components/text';
import { strings } from '@translations/locale';
import { useTheme } from '@react-navigation/native';
import { navigate } from '@navigation/ref';
import { currencyFormat } from '@utils/dateformat';
import { common } from '@utils/style';
import { white } from '@utils/colors';

const { card, row_btw, shadow } = common;

const InfoRow = ({ label, value, color }) => (
    <View style={row_btw}>
        <Text color={color} h4 entering={FadeInUp}>
            {label}
        </Text>
        <Text color={color} medium h4 entering={FadeInUp}>
            {value}
        </Text>
    </View>
);

const ConclusionCard = ({ title, amount, interest, total, onPress, bgColor }) => {
    const { colors } = useTheme();
    return (
        <Pressable onPress={onPress}>
            <Animated.View entering={ZoomIn.delay(100)} style={[card, shadow, { backgroundColor: bgColor, marginTop: 10 }]}>
                <Text color={white} bold h4 style={{ marginBottom: 10 }}>
                    {title}
                </Text>
                <InfoRow label={strings.taken_amount} value={currencyFormat(amount)} color={white} />
                <Text color={white} h4>+</Text>
                <InfoRow label={strings.total_interest} value={currencyFormat(interest)} color={white} />
                <Text color={white} h2>=</Text>
                <InfoRow label={strings.total_amount} value={currencyFormat(total)} color={white} />
            </Animated.View>
        </Pressable>
    );
};

const AadhtiyaConclusionCard = memo(({ data = [] }) => {
    const { colors } = useTheme();
    const { interest_rate, totalReceivedAmount, totalReceivedAmountInterest, totalReceivedAmountWithInterest, totalGivenAmount, totalGivenAmountInterest, totalGivenAmountWithInterest, finalAmount } = data[0] || {};

    return (
        <Fragment>
            <Text bold h5 center color={colors.error} entering={FadeInUp}>
                {strings.formatString(strings.interest_rate, interest_rate)}
            </Text>
            <ConclusionCard
                title={strings.taken_amount}
                amount={totalReceivedAmount}
                interest={totalReceivedAmountInterest}
                total={totalReceivedAmountWithInterest}
                onPress={() => navigate('AadhatDetail', { data })}
                bgColor={colors.error}
            />
            <ConclusionCard
                title={`${strings.crop} / ${strings.given_amount}`}
                amount={totalGivenAmount}
                interest={totalGivenAmountInterest}
                total={totalGivenAmountWithInterest}
                onPress={() => navigate('AadhatCropDetail', { data })}
                bgColor={colors.success}
            />
            <Animated.View entering={ZoomIn.delay(100)} style={[card, shadow, { backgroundColor: colors.secondaryCard, marginTop: 20 }]}>
                <View style={row_btw}>
                    <Text bold h3>{strings.final}</Text>
                    <Text color={finalAmount > 0 ? colors.success : colors.error} bold h3>
                        {currencyFormat(finalAmount)}
                    </Text>
                </View>
                <Text semi h6 color={finalAmount > 0 ? colors.success : colors.error} style={{ position: 'absolute', bottom: 5, alignSelf: 'center' }}>
                    {finalAmount < 0 ? strings.give : strings.receive}
                </Text>
            </Animated.View>
        </Fragment>
    );
});

export default AadhtiyaConclusionCard;
