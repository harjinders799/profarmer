import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import Text from '@components/text';
import { currencyFormat, dateFormat } from '@utils/dateformat';
import Animated, {
    BounceIn,
    BounceInLeft,
    BounceInRight,
} from 'react-native-reanimated';
import { common } from '@utils/style';

const CropEventDetail = ({ data, events }) => {
    const { colors } = useTheme();
    return (
        <View>
            {events.map((data, index) => (
                <Animated.View
                    key={index}
                    entering={
                        data?.expense_amount
                            ? BounceInLeft.delay(index * 150)
                            : data?.earning_amount
                                ? BounceInRight.delay(index * 50)
                                : BounceIn.delay(index * 50)
                    }
                    style={{ margin: 20 }}>
                    <View
                        style={[
                            common.row_btw,
                            {
                                flexDirection: data?.expense_amount ? 'row-reverse' : data?.earning_amount ? 'row' : 'column',
                                alignItems: data?.expense_amount || data?.earning_amount ? 'stretch' : 'center',
                            },
                        ]}>
                        <Text center style={{ textAlignVertical: 'center' }}>
                            {dateFormat(data?.date)}
                        </Text>
                        <Animated.View entering={BounceIn}
                            style={{
                                height: data?.expense_amount || data?.earning_amount ? 'auto' : 20,
                                width: 1,
                                opacity: 0.3,
                                margin: data?.expense_amount || data?.earning_amount ? 0 : '2%',
                                backgroundColor: data?.expense_amount
                                    ? colors.error
                                    : data?.earning_amount ? colors.success : colors.secondaryBackground,
                            }} />
                        <View
                            style={[
                                common.shadow,
                                common.card,
                                {
                                    backgroundColor: colors.background,
                                    width: data?.expense_amount || data?.earning_amount ? '70%' : '90%',
                                    marginHorizontal: data?.expense_amount || data?.earning_amount ? '0%' : '5%',
                                },
                            ]}>
                            <View
                                style={{
                                    ...common.card,
                                    ...StyleSheet.absoluteFill,
                                    backgroundColor: data?.expense_amount
                                        ? colors.error
                                        : data?.earning_amount ? colors.success : colors.secondaryCard,
                                    opacity: 0.3,
                                }}
                            />
                            <Text bold h4>
                                {data?.title}
                            </Text>
                            <Text h5 style={{ marginTop: 5 }}>
                                {data?.description}
                            </Text>
                            {data?.expense_amount ? (
                                <Text bold style={{ marginTop: 5 }}>
                                    {currencyFormat(data?.expense_amount)}
                                </Text>
                            ) : null}
                            {data?.earning_amount ? (
                                <Text bold style={{ marginTop: 5 }}>
                                    {currencyFormat(data?.earning_amount)}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                </Animated.View>
            ))}
        </View>
    );
};

export default CropEventDetail;

const styles = StyleSheet.create({});
