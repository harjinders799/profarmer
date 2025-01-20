import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Text from './text';
import Icon from './icon';
import { orange, red, white } from '@utils/colors';
import { wp } from '@utils/fonts';
import Input from './input';
import { common } from '@utils/style';
import Clipboard from '@react-native-clipboard/clipboard';
import { ToastSuccess } from '@utils/toast';

const Calculator = () => {
    const [isOpened, setIsOpened] = useState(false);
    const [input, setInput] = useState('');

    // Animations for the Calculator layout
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isOpened ? 1 : 0, {
            duration: 300,
            easing: Easing.ease,
        }),
        transform: [
            {
                translateY: withTiming(isOpened ? 0 : -100, {
                    duration: 300,
                    easing: Easing.circle,
                }),
            },
            {
                translateX: withTiming(isOpened ? 0 : 200, {
                    duration: 300,
                    easing: Easing.circle,
                }),
            },
            {
                scale: withTiming(isOpened ? 1 : 0, {
                    duration: 300,
                    easing: Easing.ease,
                }),
            },
        ],
    }));

    // Helper function to calculate the total
    const getTotal = (input) => {
        try {
            // Replace any consecutive operators with a single operator
            const sanitizedInput = input
                .replace(/[^0-9+\-*/.]/g, '') // Remove any invalid characters
                .replace(/([+\-*/])\1+/g, '$1'); // Prevent consecutive operators (like ++, --)

            // Safely evaluate the expression
            if (sanitizedInput) {
                return eval(sanitizedInput).toString();
            }
            return '';
        } catch (error) {
            return ''; // Return empty if the input is invalid or evaluation fails
        }
    };

    // Update input with validation for consecutive signs
    const handleInputChange = (sign) => {
        setInput((prev) => {
            // Prevent adding a sign at the start
            if (prev === '' && ['+', '-', '*', '/'].includes(sign)) {
                return prev;
            }
            // Prevent adding multiple consecutive signs
            if (
                ['+', '-', '*', '/'].includes(sign) &&
                ['+', '-', '*', '/'].includes(prev[prev.length - 1])
            ) {
                return prev;
            }
            // delete the last character if it is a sign
            if (sign == 'X') {
                return prev.slice(0, -1);
            }
            return prev + sign;
        });
    };

    return (
        <Animated.View>
            <Icon
                name={'calculator'}
                size={25}
                color={orange}
                onPress={() => setIsOpened((prev) => !prev)}
            />
            {isOpened && (
                <Animated.View style={[styles.calculator, animatedStyle]}>
                    <Pressable
                        style={[
                            common.row_btw,
                            { width: wp(14), position: 'absolute', top: 7, left: wp(75), alignItems: 'center' },
                        ]}
                        onPress={() => {
                            Clipboard.setString(getTotal(input));
                            setIsOpened(false);
                            ToastSuccess('Copied to clipboard');
                            setInput('');
                        }}>
                        <Icon name={'copy'} type="Feather" size={16} />
                        <Text>Copy</Text>
                    </Pressable>

                    <Input
                        autoFocus
                        keyboardType={'numeric'}
                        innerStyle={{
                            borderWidth: 0,
                            marginVertical: 10,
                            width: wp(90),
                            justifyContent: 'space-between',
                        }}
                        inputStyle={{ width: wp(50) }}
                        placeholder={'Enter Amount'}
                        value={input}
                        setValue={setInput}
                        rightComponent={
                            getTotal(input) && (
                                <Text h2>
                                    {' '}
                                    ={' '}
                                    <Text bold h2>
                                        {getTotal(input)}
                                    </Text>
                                </Text>
                            )
                        }
                    />

                    <View style={[common.row_btw, { width: wp(90) }]}>
                        <View style={[common.row_btw, { width: wp(60) }]}>
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => handleInputChange('+')}>
                                <Icon name={'plus'} size={20} color={white} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => handleInputChange('-')}>
                                <Icon name={'minus'} size={20} color={white} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => handleInputChange('*')}>
                                <Icon name={'close'} size={20} color={white} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => handleInputChange('/')}>
                                <Icon name={'divide'} type="Feather" size={20} color={white} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.icon, { backgroundColor: 'transparent' }]}
                            onPress={() => handleInputChange('X')}>
                            <Icon name={'delete'} type="Feather" size={30} color={red} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </Animated.View>
    );
};

export default Calculator;

const styles = StyleSheet.create({
    calculator: {
        backgroundColor: 'white',
        width: wp(95),
        zIndex: 999,
        position: 'absolute',
        top: 40,
        right: 0,
        padding: 10,
        elevation: 5,
        borderRadius: 10,
    },
    icon: {
        ...common.card,
        borderRadius: 8,
        padding: 0,
        aspectRatio: 1,
        width: wp(10),
        backgroundColor: orange,
    },
});
