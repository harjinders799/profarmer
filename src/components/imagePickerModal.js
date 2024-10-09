import Icon from '@components/icon';
import Text from '@components/text';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, SafeAreaView } from 'react-native';

const ImagePickerModal = ({ isVisible, onClose, onCameraPress, onGalleryPress }) => {
    const { colors } = useTheme()


    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    <TouchableOpacity style={styles.option} onPress={onCameraPress}>
                        <Icon name="camera" type='FontAwesome' size={24} />
                        <Text h4 semi style={styles.optionText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={onGalleryPress}>
                        <Icon name="image" type='FontAwesome' size={24} />
                        <Text h4 semi style={styles.optionText}>Choose from Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text h4 bold color={colors.error}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    optionText: {
        marginLeft: 15,
    },
    cancelButton: {
        marginTop: 10,
        alignItems: 'center',
    },
});

export default ImagePickerModal;
