import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import Text from '@components/text';
import Button from '@components/button';
import { useTheme } from '@react-navigation/native';
import { strings } from '@translations/locale';
import { common } from '@utils/style';
import Loader from '@components/loader';

function DeleteModal({
    openModal,
    setOpenModal,
    data,
    onDelete,
    customDescription = null,
    loading,
}) {
    const { colors } = useTheme();

    return (
        <Modal visible={openModal} animationType="slide" transparent={true}>
            <View style={[styles.container, { backgroundColor: colors.border + 50 }]}>
                <Loader visible={loading} />
                <View style={[styles.modalView, { backgroundColor: colors.background }]}>
                    <Text h2 center bold style={common.underline}>
                        {strings.are_you_sure}
                    </Text>
                    <Text justify h3 style={styles.text}>
                        <Text h2 style={{ color: colors.error }}>
                            {data?.name}
                        </Text>
                        {customDescription ?? strings.alert}
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            label={strings.delete}
                            btnStyle={[styles.button, { backgroundColor: colors.error }]}
                            onPress={onDelete}
                        />
                        <Button
                            label={strings.cancel}
                            btnStyle={[
                                styles.button,
                                { backgroundColor: colors.secondaryBackground },
                            ]}
                            onPress={() => setOpenModal(false)}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        ...common.modalView,
        width: '95%',
        padding: 10,
    },
    text: {
        marginTop: 10,
        lineHeight: 30
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        width: '45%',
    },
});

export default React.memo(DeleteModal);
