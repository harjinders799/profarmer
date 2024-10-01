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
import { navigate } from '@navigation/ref';

const CropEventDetail = ({ data, events }) => {
    const { colors } = useTheme();
    return (
        <View>
            {events.map((item, index) => (
                <Animated.View
                    key={index}
                    entering={
                        item?.expense_amount
                            ? BounceInLeft.delay(index * 150)
                            : item?.earning_amount
                                ? BounceInRight.delay(index * 50)
                                : BounceIn.delay(index * 50)
                    }
                    style={{ margin: 20 }}>
                    <TouchableOpacity
                        style={[
                            common.row_btw,
                            {
                                flexDirection: item?.expense_amount
                                    ? 'row-reverse'
                                    : item?.earning_amount
                                        ? 'row'
                                        : 'column-reverse',
                                alignItems:
                                    item?.expense_amount || item?.earning_amount
                                        ? 'stretch'
                                        : 'center',
                            },
                        ]}
                        onPress={() => navigate('AddEvent', { item, data })}>
                        <View
                            style={{
                                justifyContent:
                                    item?.expense_amount || item?.earning_amount
                                        ? 'center'
                                        : 'space-around',
                                flexDirection:
                                    item?.expense_amount || item?.earning_amount
                                        ? 'column'
                                        : 'row',
                                width:
                                    item?.expense_amount || item?.earning_amount ? 'auto' : '50%',
                            }}>
                            <Text center style={{ textAlignVertical: 'center' }}>
                                {dateFormat(item?.date)}
                            </Text>
                            <Text center style={{ textAlignVertical: 'center' }}>
                                {dayCount(item?.date)} {strings.day} ago
                            </Text>
                        </View>
                        <Animated.View
                            entering={BounceIn}
                            style={{
                                height:
                                    item?.expense_amount || item?.earning_amount ? 'auto' : 0,
                                width: 1,
                                opacity: 0.3,
                                margin: item?.expense_amount || item?.earning_amount ? 0 : '1%',
                                backgroundColor: item?.expense_amount
                                    ? colors.error
                                    : item?.earning_amount
                                        ? colors.success
                                        : colors.secondaryBackground,
                            }}
                        />
                        <View
                            style={[
                                common.shadow,
                                common.card,
                                {
                                    backgroundColor: colors.background,
                                    width:
                                        item?.expense_amount || item?.earning_amount
                                            ? '70%'
                                            : '90%',
                                    marginHorizontal:
                                        item?.expense_amount || item?.earning_amount ? '0%' : '5%',
                                },
                            ]}>
                            <View
                                style={{
                                    ...common.card,
                                    ...StyleSheet.absoluteFill,
                                    backgroundColor: item?.expense_amount
                                        ? colors.error
                                        : item?.earning_amount
                                            ? colors.success
                                            : colors.secondaryCard,
                                    opacity: 0.2,
                                }}
                            />
                            <Text bold h4>
                                {item?.title}
                            </Text>
                            <Text h5 style={{ marginTop: 5 }}>
                                {item?.description}
                            </Text>
                            {item?.expense_amount ? (
                                <Text bold style={{ marginTop: 5 }}>
                                    {currencyFormat(item?.expense_amount)}
                                </Text>
                            ) : null}
                            {item?.earning_amount ? (
                                <Text bold style={{ marginTop: 5 }}>
                                    {currencyFormat(item?.earning_amount)}
                                </Text>
                            ) : null}
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            ))}
        </View>
    );
};

export default CropEventDetail;

const styles = StyleSheet.create({});
