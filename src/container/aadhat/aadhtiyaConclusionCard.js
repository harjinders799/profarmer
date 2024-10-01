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

const { card, row_btw, underline, shadow } = common;

const AadhtiyaConclusionCard = memo(({ data = [] }) => {
    const { colors } = useTheme();

    return (
        <Fragment>
            <Text bold h5 center color={colors.error} entering={FadeInUp}>
                {strings.formatString(strings.interest_rate, data[0].interest_rate)}
            </Text>
            <Pressable onPress={() => navigate('AadhatDetail', { data })}>
                <Animated.View
                    entering={ZoomIn.delay(100)}
                    style={[
                        card,
                        shadow,
                        { backgroundColor: colors.error, marginVertical: 20 },
                    ]}>
                    <Text
                        color={white}
                        bold
                        h4
                        entering={FadeInUp}
                        style={{ marginBottom: 10 }}>
                        {strings.taken_amount}
                    </Text>
                    <View style={[row_btw]}>
                        <Text color={white} h4 entering={FadeInUp}>
                            {strings.taken_amount}
                        </Text>
                        <Text color={white} medium h4 entering={FadeInUp}>
                            {currencyFormat(data[0]?.totalReceivedAmount)}
                        </Text>
                    </View>
                    <Text color={white} h4>
                        +
                    </Text>
                    <View style={[row_btw]}>
                        <Text color={white} h4 entering={FadeInUp}>
                            {strings.total_interest}
                        </Text>
                        <Text color={white} medium h4 entering={FadeInUp}>
                            {currencyFormat(data[0]?.totalReceivedAmountInterest)}
                        </Text>
                    </View>
                    <Text color={white} h2>
                        =
                    </Text>
                    <View style={[row_btw]}>
                        <Text color={white} medium h4 entering={FadeInUp}>
                            {strings.total_amount}
                        </Text>
                        <Text color={white} medium h4 entering={FadeInUp}>
                            {currencyFormat(data[0]?.totalReceivedAmountWithInterest)}
                        </Text>
                    </View>
                </Animated.View>
            </Pressable>
            <Pressable onPress={() => navigate('AadhatCropDetail', { data })}>
                <Animated.View
                    entering={ZoomIn.delay(100)}
                    style={[card, shadow, { backgroundColor: colors.success }]}>
                    <Text
                        color={white}
                        bold
                        h4
                        entering={FadeInUp}
                        style={{ marginBottom: 10 }}>
                        {strings.crop} / {strings.given_amount}
                    </Text>
                    <View style={[row_btw]}>
                        <Text color={white} h4 entering={FadeInUp}>
                            {strings.crop} / {strings.given_amount}
                        </Text>
                        <Text color={white} medium h4 entering={FadeInUp}>
                            {currencyFormat(data[0]?.totalGivenAmount)}
                        </Text>
                    </View>
                    <Text color={white} h4>
                        +
                    </Text>
                    <View style={[row_btw]}>
                        <Text color={white} h4 entering={FadeInUp}>
                            {strings.total_interest}
                        </Text>
                        <Text color={white} medium h4 entering={FadeInUp}>
                            {currencyFormat(data[0]?.totalGivenAmountInterest)}
                        </Text>
                    </View>
                    <Text color={white} h2>
                        =
                    </Text>
                    <View style={[row_btw]}>
                        <Text color={white} medium h4 entering={FadeInUp}>
                            {strings.total_amount}
                        </Text>
                        <Text color={white} medium h4 entering={FadeInUp}>
                            {currencyFormat(data[0]?.totalGivenAmountWithInterest)}
                        </Text>
                    </View>
                </Animated.View>
            </Pressable>
            <Animated.View
                entering={ZoomIn.delay(100)}
                style={[
                    card,
                    shadow,
                    { backgroundColor: colors.secondaryCard, marginTop: 20 },
                ]}>
                <View style={[row_btw]}>
                    <Text bold h3>
                        {strings.final}
                    </Text>
                    <Text
                        color={data[0]?.finalAmount > 0 ? colors.success : colors.error}
                        bold
                        h3>
                        {currencyFormat(data[0]?.finalAmount)}
                    </Text>
                </View>
                <Text
                    semi
                    h6
                    color={data[0]?.finalAmount > 0 ? colors.success : colors.error}
                    style={{ position: 'absolute', bottom: 5, alignSelf: 'center' }}>
                    {data[0]?.finalAmount < 0 ? strings.give : strings.receive}
                </Text>
            </Animated.View>
        </Fragment>
    );
});

export default AadhtiyaConclusionCard;
