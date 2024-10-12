import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import Text from './text';
import { useTheme } from '@react-navigation/native';

export default function DropdownPicker({
    style,
    data,
    label,
    dropdownStyle,
    search = false,
    multiple = false,
    ...rest
}) {
    const [insideShow, setInsideShow] = useState(true)
    const { colors } = useTheme();
    let Component = multiple ? MultiSelect : Dropdown;
    return (
        <View style={[styles.container, style]}>
            {label ? <Text h4>{label}</Text> : null}
            <Component
                style={[styles.dropdown, { borderColor: colors.border }, dropdownStyle]}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={{
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    overflow: 'hidden'
                }}
                activeColor={colors.border + 99}
                itemTextStyle={{ color: colors.text, }}
                placeholderStyle={{ color: colors.border }}
                visibleSelectedItem
                selectedTextProps={{ style: { color: colors.text } }}
                inputSearchStyle={{ color: colors.text }}
                data={data}
                search={search}
                searchPlaceholder="Search..."
                selectedStyle={styles.selectedStyle}
                inside={insideShow}
                onFocus={() => setInsideShow(multiple ? false : true)}
                onBlur={() => setInsideShow(true)}
                {...rest}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
    },
    dropdown: {
        width: '100%',
        borderWidth: 1,
        marginTop: 5,
        borderRadius: 10,
        paddingHorizontal: 10,
        minHeight: 50,
        overflow: 'hidden'
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
