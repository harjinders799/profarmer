import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import Text from './text';
import { useTheme } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import Input from './input';

export default function DropdownPicker({
    style,
    data,
    label,
    dropdownStyle,
    search = false,
    multiple = false,
    showSelectedOnFocus = false,
    ...rest
}) {
    const [insideShow, setInsideShow] = useState(true);
    const { colors } = useTheme();
    let Component = multiple ? MultiSelect : Dropdown;
    return (
        <Animated.View {...rest} style={[styles.container, style]}>
            {label ? <Text h4>{label}</Text> : null}
            <Component
                style={[styles.dropdown, { borderColor: colors.border }, dropdownStyle]}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={{
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    overflow: 'hidden',
                }}
                activeColor={colors.border + 99}
                itemTextStyle={{ color: colors.text }}
                placeholderStyle={{ color: colors.border }}
                visibleSelectedItem
                selectedTextProps={{ style: { color: colors.text } }}
                inputSearchStyle={{ color: colors.text, textTransform: 'capitalize' }}
                data={data}
                search={search}
                searchPlaceholder="Search..."
                selectedStyle={styles.selectedStyle}
                inside={insideShow}
                onFocus={() => setInsideShow(multiple && !showSelectedOnFocus ? false : true)}
                onBlur={() => setInsideShow(true)}
                {...rest}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 10,
        marginBottom: 5
    },
    dropdown: {
        width: '100%',
        borderWidth: 1,
        marginTop: 5,
        borderRadius: 10,
        paddingHorizontal: 10,
        minHeight: 50,
        overflow: 'hidden',
    },
    selectedTextStyle: {
        // backgroundColor: 'green'
        // color: 'green',
        // padding: 20,
    },
    selectedStyle: {
        borderRadius: 10,
        // borderWidth: 0,
        // padding: 0,
        paddingVertical: 3,
        // paddingHorizontal: 10
    },
});
