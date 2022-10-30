import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { WIDTH } from 'src/utils/constant';

const Input = ({
    style,
    refs,
    value,
    setValue,
    emailType,
    numberType,
    keyboardType,
    inputStyle,
    leftComponent = null,
    placeholder,
    placeholderColor,
    ...props
}) => {
    const { colors } = useTheme();
    return (
        <View style={[styles.container, { borderColor: colors.border }, style]}>
            {leftComponent}
            <TextInput
                ref={refs}
                {...props}
                style={[styles.input, { color: colors.text }, inputStyle]}
                value={value}
                onChangeText={(text) => setValue(text)}
                placeholder={placeholder}
                keyboardType={emailType ? 'email-address' : numberType ? 'phone-pad' : keyboardType}
                placeholderTextColor={placeholderColor}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 5,
    },
    input: {
        paddingHorizontal: 15,
        fontSize: 20,
        height: 50,
        width: '100%',
    }
});

export default Input;
