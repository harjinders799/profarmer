import { View, StyleSheet } from 'react-native'
import React from 'react'
import { common } from '@utils/style'
import { greenDark, red, white } from '@utils/colors'
import { useTheme } from '@react-navigation/native'
import { currencyFormat } from '@utils/dateformat'
import { sumBy } from 'lodash'
import Text from '@components/text'
import { strings } from '@translations/locale'
import Animated, { FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight } from 'react-native-reanimated'

export default function LoanConclusion({ data }) {
    const { colors } = useTheme();
    return (
        <View style={[common.row_btw, { paddingHorizontal: 20 }]}>
            <Animated.View entering={FadeInLeft.delay(400).duration(500)} exiting={FadeOutLeft} style={[styles.card, { backgroundColor: colors.success }]}>
                <Text h3 bold color={white}>
                    {currencyFormat(
                        sumBy(data, o => parseFloat(o?.totalReceivedAmount)),
                    )}
                </Text>
                <Text h5 color={white}>
                    {strings.taken_amount}
                </Text>
                <Text h7 color={white}>
                    Without Interest
                </Text>
            </Animated.View>
            <Animated.View entering={FadeInRight.delay(400).duration(500)} exiting={FadeOutRight} style={[styles.card, { backgroundColor: colors.error }]}>
                <Text h3 bold color={white}>
                    {currencyFormat(sumBy(data, o => parseFloat(o?.totalGivenAmount)))}
                </Text>
                <Text h5 color={white}>
                    {strings.given_amount}
                </Text>
                <Text h7 color={white}>
                    Without Interest
                </Text>
            </Animated.View>
        </View>
    )
}
const styles = StyleSheet.create({
    card: {
        ...common.shadow,
        ...common.card,
        width: '48%',
        marginBottom: 20,
    },
})