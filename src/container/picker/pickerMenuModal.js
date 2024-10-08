import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { useTheme } from '@react-navigation/native';
import Icon from '@components/icon';
import Text from '@components/text';
import { strings } from '@translations/locale';
import { common } from '@utils/style';

const MenuOptionItem = React.memo(
    ({ iconName, label, onSelect, iconType, iconColor }) => (
        <>
            <MenuOption onSelect={onSelect}>
                <View style={styles.menuOption}>
                    <Icon name={iconName} size={20} type={iconType} color={iconColor} />
                    <Text h5 style={styles.text}>
                        {label}
                    </Text>
                </View>
            </MenuOption>
            <View style={styles.divider} />
        </>
    ),
);

const PickerMenuModal = ({ handleShare, onDeletePress, onEditPress, onSettingPress }) => {
    const { colors } = useTheme();
    const [showPopup, setShowPopup] = useState(false);

    const handleTogglePopup = useCallback(() => {
        setShowPopup(prev => !prev);
    }, []);

    return (
        <Menu opened={showPopup} onBackdropPress={handleTogglePopup}>
            <MenuTrigger>
                <TouchableOpacity style={styles.trigger} onPress={handleTogglePopup}>
                    <Icon name="more-vert" type="MaterialIcons" size={30} />
                </TouchableOpacity>
            </MenuTrigger>
            <MenuOptions
                customStyles={{
                    optionsWrapper: {
                        ...styles.optionsWrapper,
                        backgroundColor: colors.background,
                    },
                    optionsContainer: {
                        backgroundColor: 'transparent',
                        elevation: 0,
                    },
                }}
                optionsContainerStyle={styles.optionsContainer}>
                <MenuOptionItem
                    iconName="edit"
                    iconType="MaterialIcons"
                    label="Edit"
                    onSelect={() => { setShowPopup(false); onEditPress() }}
                />
                <MenuOptionItem
                    iconName="pdffile1"
                    label={strings.share}
                    onSelect={() => { setShowPopup(false); handleShare() }}
                />
                {<MenuOptionItem
                    iconName="admin-panel-settings"
                    iconType="MaterialIcons"
                    label={strings.settings}
                    onSelect={() => { setShowPopup(false); onSettingPress() }}
                />}
                <MenuOptionItem
                    iconName="trash-can"
                    label={strings.delete}
                    onSelect={() => { setShowPopup(false); onDeletePress() }}
                    iconType="FontAwesome6"
                    iconColor={colors.error}
                />
            </MenuOptions>
        </Menu>
    );
};

const styles = StyleSheet.create({
    trigger: {
        zIndex: 99,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    text: {
        marginLeft: 10,
    },
    divider: {
        height: 0.5,
        backgroundColor: 'transparent', // Will be set dynamically
    },
    optionsContainer: {
        width: 'auto',
    },
    optionsWrapper: {
        top: 20,
        right: 20,
        borderRadius: 5,
        overflow: 'hidden',
        minWidth: '35%',
        ...common.shadow,
    },
});

export default PickerMenuModal;
